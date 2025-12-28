import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
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

  // Account: Export JSON
  app.get(api.account.exportJson.path, requireUser, async (req, res) => {
    const userId = (req as any).user.id as string;
    const data = await storage.exportUserPromptsJson(userId);
    res.json(data);
  });

  // Account: Export CSV
  app.get(api.account.exportCsv.path, requireUser, async (req, res) => {
    const userId = (req as any).user.id as string;
    const csv = await storage.exportUserPromptsCsv(userId);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.send(csv);
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
  app.post(api.prompts.create.path, requireUser, async (req, res) => {
    try {
      const input = api.prompts.create.input.parse(req.body);
      const prompt = await storage.createPrompt(input);
      res.status(201).json(prompt);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
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
          message: err.errors[0].message,
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
    console.log("Seeding database...");
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
