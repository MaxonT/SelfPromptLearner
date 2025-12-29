import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "../shared/routes";
import { z } from "zod";
import passport from "passport";
import { hashPassword, newApiToken, requireUser } from "./auth";

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
  app.post(api.auth.register.path, async (req, res) => {
    const input = api.auth.register.input.parse(req.body);
    const existing = await storage.getUserByEmail(input.email);
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const passwordHash = hashPassword(input.password);
    const apiToken = newApiToken();
    const user = await storage.createUser(input.email, passwordHash, apiToken);

    // establish session
    await new Promise<void>((resolve, reject) => {
      // @ts-ignore
      req.login({ id: user.id }, (err) => err ? reject(err) : resolve());
    });

    return res.status(201).json({ ok: true, apiToken: user.apiToken, email: user.email });
  });

  // Auth: Login
  app.post(api.auth.login.path, (req, res, next) => {
    const input = api.auth.login.input.parse(req.body);
    req.body.email = input.email;
    req.body.password = input.password;

    passport.authenticate("local", async (err: any, user: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      // @ts-ignore
      req.login(user, async (err2) => {
        if (err2) return next(err2);
        const full = await storage.getUserByEmail(input.email);
        return res.json({ ok: true, apiToken: full?.apiToken ?? "", email: input.email });
      });
    })(req, res, next);
  });

  // Auth: Logout
  app.post(api.auth.logout.path, (req, res) => {
    // @ts-ignore
    req.logout?.(() => {});
    // @ts-ignore
    req.session?.destroy?.(() => {});
    res.json({ ok: true });
  });

    // Auth: Me
  app.get(api.auth.me.path, requireUser, async (req, res) => {
    const userId = (req as any).user.id as string;
    const u = await storage.getUserById(userId);
    res.json({ ok: true, email: u?.email ?? "", apiToken: u?.apiToken ?? "" });
  });

// Auth: Rotate Token
  app.post(api.auth.rotateToken.path, requireUser, async (req, res) => {
    const userId = (req as any).user.id as string;
    const token = newApiToken();
    const apiToken = await storage.rotateUserToken(userId, token);
    res.json({ ok: true, apiToken });
  });

  // Account: Export JSON (streaming)
  app.get(api.account.status.path, requireUser, async (req, res) => {
    const userId = (req as any).user.id as string;
    const status = await storage.getAccountStatus(userId);
    res.json({ ok: true, totalPrompts: status.totalPrompts, lastIngestAt: status.lastIngestAt });
  });

app.get(api.account.exportJson.path, requireUser, async (req, res) => {
  const userId = (req as any).user.id as string;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="spr-prompts.json"');

  const limit = 1000;
  let offset = 0;
  let first = true;

  res.write('{"exportedAt":"' + new Date().toISOString() + '","prompts":[');
  while (true) {
    const batch = await storage.getPrompts(userId, { limit, offset, sortBy: "date" });
    if (!batch.length) break;
    for (const p of batch) {
      const row = JSON.stringify(p);
      if (first) { res.write(row); first = false; }
      else { res.write("," + row); }
    }
    offset += batch.length;
    if (batch.length < limit) break;
  }
  res.write("]}");
  res.end();
});

  // Account: Export CSV (streaming)
app.get(api.account.exportCsv.path, requireUser, async (req, res) => {
  const userId = (req as any).user.id as string;
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
    if (!batch.length) break;

    for (const p of batch) {
      const tags = Array.isArray((p as any).tags) ? (p as any).tags.join("|") : "";
      const line = [
        esc((p as any).id),
        esc((p as any).createdAt),
        esc((p as any).site),
        esc((p as any).pageUrl),
        esc((p as any).conversationId),
        esc((p as any).promptText),
        esc((p as any).deviceId),
        esc((p as any).clientEventId),
        esc((p as any).promptHash),
        esc((p as any).taskType),
        esc((p as any).intent),
        esc((p as any).riskFlag),
        esc(tags),
      ].join(",") + "\n";
      res.write(line);
    }

    offset += batch.length;
    if (batch.length < limit) break;
  }
  res.end();
});

  // Account: Delete All
  app.post(api.account.deleteAll.path, requireUser, async (req, res) => {
    const userId = (req as any).user.id as string;
    await storage.deleteAllUserData(userId);
    // @ts-ignore
    req.logout?.(() => {});
    // @ts-ignore
    req.session?.destroy?.(() => {});
    res.json({ ok: true });
  });

  // Extension: Status upsert (token or session)
  app.post('/api/extension/status', requireUser, async (req, res) => {
    const userId = (req as any).user.id as string;
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
  });

  // Extension: Status query (dashboard)
  app.get(api.extension.statusGet.path, requireUser, async (req, res) => {
    const userId = (req as any).user.id as string;
    const devices = await storage.getExtensionStatus(userId);
    res.json({ ok: true, devices });
  });

  // Extension: request retry (dashboard)
  app.post(api.extension.retryFailed.path, requireUser, async (req, res) => {
    const userId = (req as any).user.id as string;
    const input = (api.extension.retryFailed.input ?? z.object({ deviceId: z.string().optional() })).parse(req.body ?? {});
    await storage.enqueueExtensionCommand(userId, 'retry_failed', input.deviceId ?? null, null);
    res.json({ ok: true });
  });

  // Extension: poll commands (token recommended)
  app.get('/api/extension/commands', requireUser, async (req, res) => {
    const userId = (req as any).user.id as string;
    const deviceId = String((req.query as any)?.deviceId || '');
    if (!deviceId) return res.status(400).json({ message: 'deviceId required' });
    const cmds = await storage.consumeExtensionCommands(userId, deviceId);
    res.json({ ok: true, commands: cmds });
  });

  
  // List prompts
  app.get(api.prompts.list.path, requireUser, async (req, res) => {
    try {
      const params = api.prompts.list.input?.parse(req.query);
      const userId = (req as any).user.id as string;
      const result = await storage.getPrompts(userId, params);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch prompts" });
    }
  });

  // List tags
  app.get(api.tags.list.path, requireUser, async (req, res) => {
    try {
      const userId = (req as any).user.id as string;
      const tags = await storage.getTags(userId);
      res.json({ tags });
    } catch (_err) {
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  // List taxonomy (taskType/intent/riskFlags)
  app.get(api.taxonomy.list.path, requireUser, async (req, res) => {
    try {
      const userId = (req as any).user.id as string;
    const data = await storage.getTaxonomy(userId);
      res.json(data);
    } catch (_err) {
      res.status(500).json({ message: "Failed to fetch taxonomy" });
    }
  });


  // Get prompt
  app.get(api.prompts.get.path, requireUser, async (req, res) => {
    const userId = (req as any).user.id as string;
      const prompt = await storage.getPrompt(userId, req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    res.json(prompt);
  });

  // Create prompt (Sync from extension)
  // Rate limit: lightweight in-memory limiter per user to reduce abuse
  const __ingestWindowMs = 60_000;
  const __ingestMaxPerWindow = Number(process.env.INGEST_RATE_LIMIT_PER_MIN || 120);
  const __ingestHits = new Map<string, { ts: number; count: number }>();

  app.post(api.prompts.create.path, requireUser, async (req, res) => {
    const userId = (req as any).user.id as string;
    const now = Date.now();
    const hit = __ingestHits.get(userId);
    if (!hit || now - hit.ts > __ingestWindowMs) {
      __ingestHits.set(userId, { ts: now, count: 1 });
    } else {
      hit.count += 1;
      if (hit.count > __ingestMaxPerWindow) {
        const requestId = (req as any).requestId;
        return res.status(429).json({ code: "RATE_LIMITED", message: "Too many ingestion requests", requestId });
      }
    }

    try {
      const input = api.prompts.create.input.parse(req.body);
      const userId = (req as any).user.id as string;
      const prompt = await storage.createPrompt(userId, input);
      res.status(201).json(prompt);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          code: "VALIDATION_ERROR",
          message: err.errors[0].message,
          requestId: (req as any).requestId,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Update prompt
  app.put(api.prompts.update.path, requireUser, async (req, res) => {
    try {
      const input = api.prompts.update.input.parse(req.body);
      const userId = (req as any).user.id as string;
      const prompt = await storage.updatePrompt(userId, req.params.id, input);
      res.json(prompt);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          code: "VALIDATION_ERROR",
          message: err.errors[0].message,
          requestId: (req as any).requestId,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(404).json({ message: "Prompt not found or update failed" });
    }
  });

  // Delete prompt
  app.delete(api.prompts.delete.path, requireUser, async (req, res) => {
    const userId = (req as any).user.id as string;
      await storage.deletePrompt(userId, req.params.id);
    res.status(204).send();
  });

  // Analytics Summary
  app.get(api.prompts.analytics.path, requireUser, async (req, res) => {
    const userId = (req as any).user.id as string;
      const summary = await storage.getAnalyticsSummary(userId);
    res.json(summary);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getPrompts({ limit: 1, offset: 0 });
  if (existing.total === 0) {
   // Seeding sample data (dev only)
    const samplePrompts = [
      {
        site: "chatgpt",
        pageUrl: "https://chat.openai.com/c/123",
        promptText: "Write a React component for a sortable table with filtering.",
        promptHash: "hash1",
        meta: {
          lengthChars: 55,
          lengthTokensEst: 12,
          isEdit: false,
          submitMethod: "enter"
        },
        tags: ["coding", "react"],
        analysis: {
          taxonomy: {
            taskType: ["coding"],
            intent: ["command"],
            constraints: ["sortable", "filtering"],
            riskFlags: []
          },
          scores: { clarity: 85, ambiguity: 10, reproducibility: 90 },
          traits: ["precision", "context-minimalist"],
          suggestions: ["Add accessibility requirements"]
        }
      },
      {
        site: "claude",
        pageUrl: "https://claude.ai/chat/abc",
        promptText: "Explain the difference between useEffect and useLayoutEffect. Give examples.",
        promptHash: "hash2",
        meta: {
          lengthChars: 72,
          lengthTokensEst: 18,
          isEdit: false,
          submitMethod: "click"
        },
        tags: ["study", "react"],
        analysis: {
          taxonomy: {
            taskType: ["study"],
            intent: ["ask"],
            constraints: ["examples"],
            riskFlags: []
          },
          scores: { clarity: 90, ambiguity: 5, reproducibility: 80 },
          traits: ["exploration"],
          suggestions: []
        }
      }
    ];

    for (const p of samplePrompts) {
      await storage.createPrompt(p);
    }
  }
}
