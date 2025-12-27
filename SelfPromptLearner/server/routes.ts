import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // List prompts
  app.get(api.prompts.list.path, async (req, res) => {
    try {
      const params = api.prompts.list.input?.parse(req.query);
      const prompts = await storage.getPrompts(params);
      res.json(prompts);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch prompts" });
    }
  });

  // Get prompt
  app.get(api.prompts.get.path, async (req, res) => {
    const prompt = await storage.getPrompt(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    res.json(prompt);
  });

  // Create prompt (Sync from extension)
  app.post(api.prompts.create.path, async (req, res) => {
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
  app.put(api.prompts.update.path, async (req, res) => {
    try {
      const input = api.prompts.update.input.parse(req.body);
      const prompt = await storage.updatePrompt(req.params.id, input);
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
  app.delete(api.prompts.delete.path, async (req, res) => {
    await storage.deletePrompt(req.params.id);
    res.status(204).send();
  });

  // Analytics Summary
  app.get(api.prompts.analytics.path, async (req, res) => {
    const summary = await storage.getAnalyticsSummary();
    res.json(summary);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getPrompts();
  if (existing.length === 0) {
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
