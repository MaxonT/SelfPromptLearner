import type { Express, Request, Response } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "../shared/routes";
import { z } from "zod";
import passport from "passport";
import { hashPassword, newApiToken, requireUser } from "./auth";
import { log } from "./index";

// Helper function to send standardized error responses
function sendError(res: Response, req: Request, statusCode: number, code: string, message: string) {
  const requestId = req.requestId || "unknown";
  return res.status(statusCode).json({ code, message, requestId });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // E2E Fixture: stable page for extension tests (does not depend on ChatGPT/Claude DOM)
  app.get("/e2e/fixture/chat.html", (_req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>SPR E2E Fixture</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    textarea { width: 100%; height: 120px; }
    button { margin-top: 10px; padding: 8px 12px; }
    .hint { margin-top: 12px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <h1>SPR E2E Fixture</h1>
  <textarea id="spr-prompt" placeholder="Type a prompt here..."></textarea>
  <button id="spr-send">Send</button>
  <div class="hint">
    This page is used for automated extension E2E tests. It provides a stable DOM.
  </div>
  <script>
    document.getElementById("spr-send").addEventListener("click", () => {
      window.__sprLastPrompt = document.getElementById("spr-prompt").value || "";
    });
  </script>
</body>
</html>`);
  });


  // Auth: Register
  app.post(api.auth.register.path, async (req, res, next) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByEmail(input.email);
      if (existing) {
        return sendError(res, req, 400, "EMAIL_IN_USE", "Email already in use");
      }

      const passwordHash = hashPassword(input.password);
      const apiToken = newApiToken();
      const user = await storage.createUser(input.email, passwordHash, apiToken);

      // establish session
      await new Promise<void>((resolve, reject) => {
        req.login({ id: user.id }, (err) => {
          if (err) {
            log(`Session login error during register: ${err.message}`, "auth");
            return reject(err);
          }
          resolve();
        });
      });

      return res.status(201).json({ ok: true, apiToken: user.apiToken, email: user.email });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return sendError(res, req, 400, "VALIDATION_ERROR", err.errors[0]?.message || "Invalid input");
      }
      log(`Register error: ${err?.message || String(err)}`, "auth");
      const statusCode = err.statusCode || 500;
      return sendError(res, req, statusCode, err.code || "INTERNAL_ERROR", err.message || "Internal server error");
    }
  });

  // Auth: Login
  app.post(api.auth.login.path, (req, res, next) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      req.body.email = input.email;
      req.body.password = input.password;

      passport.authenticate("local", async (err: any, user: any) => {
        if (err) {
          log(`Login passport error: ${err.message || String(err)}`, "auth");
          return sendError(res, req, 500, "AUTH_ERROR", err.message || "Authentication failed");
        }
        if (!user) {
          return sendError(res, req, 401, "INVALID_CREDENTIALS", "Invalid credentials");
        }

        req.login(user, async (err2) => {
          if (err2) {
            log(`Login session error: ${err2.message || String(err2)}`, "auth");
            return sendError(res, req, 500, "SESSION_ERROR", err2.message || "Session creation failed");
          }
          try {
            const full = await storage.getUserByEmail(input.email);
            return res.json({ ok: true, apiToken: full?.apiToken ?? "", email: input.email });
          } catch (dbErr: any) {
            log(`Login database error: ${dbErr.message || String(dbErr)}`, "auth");
            return sendError(res, req, 500, "DB_ERROR", dbErr.message || "Database error");
          }
        });
      })(req, res, next);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return sendError(res, req, 400, "VALIDATION_ERROR", err.errors[0]?.message || "Invalid input");
      }
      log(`Login parse error: ${err?.message || String(err)}`, "auth");
      return sendError(res, req, 500, "PARSE_ERROR", err.message || "Internal server error");
    }
  });

  // Auth: Logout
  app.post(api.auth.logout.path, (req, res) => {
    try {
      req.logout?.(() => {});
      req.session?.destroy?.(() => {});
      res.json({ ok: true });
    } catch (err: any) {
      log(`Logout error: ${err?.message || String(err)}`, "auth");
      sendError(res, req, 500, "LOGOUT_ERROR", "Failed to logout");
    }
  });

    // Auth: Me
  app.get(api.auth.me.path, requireUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const u = await storage.getUserById(userId);
      if (!u) {
        return sendError(res, req, 404, "USER_NOT_FOUND", "User not found");
      }
      res.json({ ok: true, email: u.email, apiToken: u.apiToken });
    } catch (err: any) {
      log(`Get user error: ${err?.message || String(err)}`, "auth");
      sendError(res, req, 500, "DB_ERROR", "Failed to fetch user");
    }
  });

// Auth: Rotate Token
  app.post(api.auth.rotateToken.path, requireUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const token = newApiToken();
      const apiToken = await storage.rotateUserToken(userId, token);
      res.json({ ok: true, apiToken });
    } catch (err: any) {
      log(`Rotate token error: ${err?.message || String(err)}`, "auth");
      sendError(res, req, 500, "TOKEN_ROTATE_ERROR", "Failed to rotate token");
    }
  });

  // Account: Export JSON (streaming)
  app.get(api.account.status.path, requireUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const status = await storage.getAccountStatus(userId);
      res.json({ ok: true, totalPrompts: status.totalPrompts, lastIngestAt: status.lastIngestAt });
    } catch (err: any) {
      log(`Get account status error: ${err?.message || String(err)}`, "account");
      sendError(res, req, 500, "DB_ERROR", "Failed to fetch account status");
    }
  });

app.get(api.account.exportJson.path, requireUser, async (req, res) => {
  try {
    const userId = req.user!.id;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="spr-prompts.json"');

    const limit = 1000;
    let offset = 0;
    let first = true;

    res.write('{"exportedAt":"' + new Date().toISOString() + '","prompts":[');
    while (true) {
      const batch = await storage.getPrompts(userId, { limit, offset, sortBy: "date" });
      if (!batch.items.length) break;
      for (const p of batch.items) {
        const row = JSON.stringify(p);
        if (first) { res.write(row); first = false; }
        else { res.write("," + row); }
      }
      offset += batch.items.length;
      if (batch.items.length < limit) break;
    }
    res.write("]}");
    res.end();
  } catch (err: any) {
    log(`Export JSON error: ${err?.message || String(err)}`, "account");
    if (!res.headersSent) {
      sendError(res, req, 500, "EXPORT_ERROR", "Failed to export data");
    }
  }
});

  // Account: Export CSV (streaming)
app.get(api.account.exportCsv.path, requireUser, async (req, res) => {
  try {
    const userId = req.user!.id;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="spr-prompts.csv"');

    const header = ["id","createdAt","site","pageUrl","conversationId","promptText","deviceId","clientEventId","promptHash","taskType","intent","riskFlag","tags"].join(",") + "\n";
    res.write(header);

    const esc = (s: any) => {
      const v = (s ?? "").toString().replace(/"/g, '""');
      return '"' + v + '"';
    };

    const limit = 1000;
    let offset = 0;
    while (true) {
      const batch = await storage.getPrompts(userId, { limit, offset, sortBy: "date" });
      if (!batch.items.length) break;

      for (const p of batch.items) {
        const tags = Array.isArray(p.tags) ? p.tags.join("|") : "";
        const analysis = p.analysis as { taxonomy?: { taskType?: string[]; intent?: string[]; riskFlags?: string[] } } | null | undefined;
        const taskType = analysis?.taxonomy?.taskType?.join("|") || "";
        const intent = analysis?.taxonomy?.intent?.join("|") || "";
        const riskFlag = analysis?.taxonomy?.riskFlags?.join("|") || "";
        const line = [
          esc(p.id),
          esc(p.createdAt?.toISOString() || ""),
          esc(p.site),
          esc(p.pageUrl),
          esc(p.conversationId || ""),
          esc(p.promptText),
          esc(p.deviceId),
          esc(p.clientEventId),
          esc(p.promptHash),
          esc(taskType),
          esc(intent),
          esc(riskFlag),
          esc(tags),
        ].join(",") + "\n";
        res.write(line);
      }

      offset += batch.items.length;
      if (batch.items.length < limit) break;
    }
    res.end();
  } catch (err: any) {
    log(`Export CSV error: ${err?.message || String(err)}`, "account");
    if (!res.headersSent) {
      sendError(res, req, 500, "EXPORT_ERROR", "Failed to export data");
    }
  }
});

  // Account: Delete All
  app.post(api.account.deleteAll.path, requireUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      await storage.deleteAllUserData(userId);
      req.logout?.(() => {});
      req.session?.destroy?.(() => {});
      res.json({ ok: true });
    } catch (err: any) {
      log(`Delete all data error: ${err?.message || String(err)}`, "account");
      sendError(res, req, 500, "DELETE_ERROR", "Failed to delete data");
    }
  });

  // Extension: Status upsert (token or session)
  app.post('/api/extension/status', requireUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const input = z.object({
        deviceId: z.string().min(1),
        pending: z.number().int().nonnegative(),
        failed: z.number().int().nonnegative(),
        sending: z.number().int().nonnegative(),
        lastRequestId: z.string().nullable().optional(),
        lastSyncAt: z.string().nullable().optional(),
        lastSyncError: z.string().nullable().optional(),
      }).parse(req.body);

      await storage.upsertExtensionStatus(userId, input);
      res.json({ ok: true });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return sendError(res, req, 400, "VALIDATION_ERROR", err.errors[0]?.message || "Invalid input");
      }
      log(`Extension status upsert error: ${err?.message || String(err)}`, "extension");
      sendError(res, req, 500, "DB_ERROR", "Failed to update extension status");
    }
  });

  // Extension: Status query (dashboard)
  app.get(api.extension.statusGet.path, requireUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const devices = await storage.getExtensionStatus(userId);
      res.json({ ok: true, devices });
    } catch (err: any) {
      log(`Extension status get error: ${err?.message || String(err)}`, "extension");
      sendError(res, req, 500, "DB_ERROR", "Failed to fetch extension status");
    }
  });

  // Extension: request retry (dashboard)
  app.post(api.extension.retryFailed.path, requireUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const input = (api.extension.retryFailed.input ?? z.object({ deviceId: z.string().optional() })).parse(req.body ?? {});
      await storage.enqueueExtensionCommand(userId, 'retry_failed', input.deviceId ?? null, null);
      res.json({ ok: true });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return sendError(res, req, 400, "VALIDATION_ERROR", err.errors[0]?.message || "Invalid input");
      }
      log(`Extension retry error: ${err?.message || String(err)}`, "extension");
      sendError(res, req, 500, "DB_ERROR", "Failed to enqueue retry command");
    }
  });

  // Extension: poll commands (token recommended)
  app.get('/api/extension/commands', requireUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const deviceId = typeof req.query.deviceId === 'string' ? req.query.deviceId : '';
      if (!deviceId) {
        return sendError(res, req, 400, "VALIDATION_ERROR", "deviceId required");
      }
      const cmds = await storage.consumeExtensionCommands(userId, deviceId);
      res.json({ ok: true, commands: cmds });
    } catch (err: any) {
      log(`Extension commands error: ${err?.message || String(err)}`, "extension");
      sendError(res, req, 500, "DB_ERROR", "Failed to fetch commands");
    }
  });

  
  // List prompts
  app.get(api.prompts.list.path, requireUser, async (req, res) => {
    try {
      const params = api.prompts.list.input?.parse(req.query);
      const userId = req.user!.id;
      const result = await storage.getPrompts(userId, params);
      res.json(result);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return sendError(res, req, 400, "VALIDATION_ERROR", err.errors[0]?.message || "Invalid query parameters");
      }
      log(`List prompts error: ${err?.message || String(err)}`, "prompts");
      sendError(res, req, 500, "DB_ERROR", "Failed to fetch prompts");
    }
  });

  // List tags
  app.get(api.tags.list.path, requireUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const tags = await storage.getTags(userId);
      res.json({ tags });
    } catch (err: any) {
      log(`List tags error: ${err?.message || String(err)}`, "tags");
      sendError(res, req, 500, "DB_ERROR", "Failed to fetch tags");
    }
  });

  // List taxonomy (taskType/intent/riskFlags)
  app.get(api.taxonomy.list.path, requireUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const data = await storage.getTaxonomy(userId);
      res.json(data);
    } catch (err: any) {
      log(`List taxonomy error: ${err?.message || String(err)}`, "taxonomy");
      sendError(res, req, 500, "DB_ERROR", "Failed to fetch taxonomy");
    }
  });


  // Get prompt
  app.get(api.prompts.get.path, requireUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const prompt = await storage.getPrompt(userId, req.params.id);
      if (!prompt) {
        return sendError(res, req, 404, "NOT_FOUND", "Prompt not found");
      }
      res.json(prompt);
    } catch (err: any) {
      log(`Get prompt error: ${err?.message || String(err)}`, "prompts");
      sendError(res, req, 500, "DB_ERROR", "Failed to fetch prompt");
    }
  });

  // Create prompt (Sync from extension)
  // Rate limit: lightweight in-memory limiter per user to reduce abuse
  const __ingestWindowMs = 60_000;
  const __ingestMaxPerWindow = Number(process.env.INGEST_RATE_LIMIT_PER_MIN || 120);
  const __ingestHits = new Map<string, { ts: number; count: number }>();

  app.post(api.prompts.create.path, requireUser, async (req, res) => {
    const userId = req.user!.id;
    const now = Date.now();
    const hit = __ingestHits.get(userId);
    if (!hit || now - hit.ts > __ingestWindowMs) {
      __ingestHits.set(userId, { ts: now, count: 1 });
    } else {
      hit.count += 1;
      if (hit.count > __ingestMaxPerWindow) {
        return sendError(res, req, 429, "RATE_LIMITED", "Too many ingestion requests");
      }
    }

    try {
      const input = api.prompts.create.input.parse(req.body);
      const prompt = await storage.createPrompt(userId, input);
      res.status(201).json(prompt);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return sendError(res, req, 400, "VALIDATION_ERROR", err.errors[0]?.message || "Invalid input");
      }
      log(`Create prompt error: ${err instanceof Error ? err.message : String(err)}`, "prompts");
      sendError(res, req, 500, "DB_ERROR", "Failed to create prompt");
    }
  });

  // Update prompt
  app.put(api.prompts.update.path, requireUser, async (req, res) => {
    try {
      const input = api.prompts.update.input.parse(req.body);
      const userId = req.user!.id;
      const prompt = await storage.updatePrompt(userId, req.params.id, input);
      res.json(prompt);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return sendError(res, req, 400, "VALIDATION_ERROR", err.errors[0]?.message || "Invalid input");
      }
      log(`Update prompt error: ${err?.message || String(err)}`, "prompts");
      sendError(res, req, 404, "NOT_FOUND", "Prompt not found or update failed");
    }
  });

  // Delete prompt
  app.delete(api.prompts.delete.path, requireUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      await storage.deletePrompt(userId, req.params.id);
      res.status(204).send();
    } catch (err: any) {
      log(`Delete prompt error: ${err?.message || String(err)}`, "prompts");
      sendError(res, req, 500, "DB_ERROR", "Failed to delete prompt");
    }
  });

  // Analytics Summary
  app.get(api.prompts.analytics.path, requireUser, async (req, res) => {
    try {
      const userId = req.user!.id;
      const summary = await storage.getAnalyticsSummary(userId);
      res.json(summary);
    } catch (err: any) {
      log(`Analytics summary error: ${err?.message || String(err)}`, "analytics");
      sendError(res, req, 500, "DB_ERROR", "Failed to fetch analytics");
    }
  });

  // Seed Data (only if tables exist)
  try {
    await seedDatabase();
  } catch (err: any) {
    // Ignore errors if tables don't exist yet (need to run db:push first)
    if (err?.code !== '42P01' && !err?.message?.includes('does not exist')) {
      log(`Seed database error: ${err?.message || String(err)}`, "seed");
    }
  }

  return httpServer;
}

async function seedDatabase() {
  // Skip seeding in production - users should create their own prompts
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  
  // For dev: seeding is disabled - users should register and create their own prompts
  return;
}
