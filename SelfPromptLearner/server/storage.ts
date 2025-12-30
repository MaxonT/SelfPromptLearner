import { db } from "./db";
import {
  prompts,
  type Prompt,
  type InsertPrompt,
  type UpdatePromptRequest,
  type PromptsQueryParams
} from "@shared/schema";
import { eq, desc, ilike, and, sql } from "drizzle-orm";

export interface IStorage {
  getPrompts(params?: PromptsQueryParams): Promise<Prompt[]>;
  getPrompt(id: string): Promise<Prompt | undefined>;
  createPrompt(prompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(id: string, updates: UpdatePromptRequest): Promise<Prompt>;
  deletePrompt(id: string): Promise<void>;
  getAnalyticsSummary(): Promise<{
    totalPrompts: number;
    bySite: Record<string, number>;
    averageClarity: number;
    recentTraits: string[];
  }>;
}

export class DatabaseStorage implements IStorage {
  async getPrompts(params?: PromptsQueryParams): Promise<Prompt[]> {
    const conditions = [];
    if (params?.search) {
      conditions.push(ilike(prompts.promptText, `%${params.search}%`));
    }
    if (params?.site && params.site !== 'all') {
      conditions.push(eq(prompts.site, params.site));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderByClause =
      params?.sortBy === 'clarity'
        ? desc(sql`COALESCE((analysis->'scores'->>'clarity')::int, 0)`)
        : desc(prompts.createdAt);

    const baseQuery = db.select().from(prompts);
    const filteredQuery = whereClause ? baseQuery.where(whereClause) : baseQuery;

    return await filteredQuery.orderBy(orderByClause);
  }

  async getPrompt(id: string): Promise<Prompt | undefined> {
    const [prompt] = await db.select().from(prompts).where(eq(prompts.id, id));
    return prompt;
  }

  async createPrompt(prompt: InsertPrompt): Promise<Prompt> {
    const [newPrompt] = await db.insert(prompts).values(prompt).returning();
    return newPrompt;
  }

  async updatePrompt(id: string, updates: UpdatePromptRequest): Promise<Prompt> {
    const [updated] = await db.update(prompts)
      .set(updates)
      .where(eq(prompts.id, id))
      .returning();
    return updated;
  }

  async deletePrompt(id: string): Promise<void> {
    await db.delete(prompts).where(eq(prompts.id, id));
  }

  async getAnalyticsSummary() {
    const allPrompts = await db.select().from(prompts);
    
    const totalPrompts = allPrompts.length;
    
    const bySite: Record<string, number> = {};
    let totalClarity = 0;
    const traitsSet = new Set<string>();

    allPrompts.forEach(p => {
      // Count by site
      bySite[p.site] = (bySite[p.site] || 0) + 1;
      
      // Sum clarity
      if (p.analysis?.scores?.clarity) {
        totalClarity += p.analysis.scores.clarity;
      }

      // Collect traits
      p.analysis?.traits?.forEach(t => traitsSet.add(t));
    });

    const averageClarity = totalPrompts > 0 ? Math.round(totalClarity / totalPrompts) : 0;
    const recentTraits = Array.from(traitsSet).slice(0, 5); // Just take top 5 for now

    return {
      totalPrompts,
      bySite,
      averageClarity,
      recentTraits
    };
  }
}

export const storage = new DatabaseStorage();
