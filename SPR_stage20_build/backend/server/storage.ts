import { db } from "./db";
import {
  prompts,
  type Prompt,
  type InsertPrompt,
  type UpdatePromptRequest,
  type PromptsQueryParams,
  users,
  extensionStatus,
  extensionCommands
} from "../shared/schema";
import { eq, desc, ilike, and, sql, asc } from "drizzle-orm";
import { analyzePromptText } from "../shared/analyzer";

export interface IStorage {

  createUser(email: string, passwordHash: string, apiToken: string): Promise<{ id: string; email: string; apiToken: string }>;
  getUserByEmail(email: string): Promise<{ id: string; email: string; passwordHash: string; apiToken: string } | undefined>;
  getUserByToken(apiToken: string): Promise<{ id: string; email: string; apiToken: string } | undefined>;
  getUserById(userId: string): Promise<{ id: string; email: string; apiToken: string } | undefined>;
  rotateUserToken(userId: string, apiToken: string): Promise<string>;
  exportUserPromptsJson(userId: string): Promise<any>;
  exportUserPromptsCsv(userId: string): Promise<string>;
  deleteAllUserData(userId: string): Promise<void>;

  getPrompts(userId: string, params?: PromptsQueryParams): Promise<{ items: Prompt[]; total: number; limit: number; offset: number }>;
  getPrompt(userId: string, id: string): Promise<Prompt | undefined>;
  createPrompt(userId: string, prompt: InsertPrompt): Promise<Prompt>;
  updatePrompt(userId: string, id: string, updates: UpdatePromptRequest): Promise<Prompt>;
  deletePrompt(userId: string, id: string): Promise<void>;
  getTags(userId: string): Promise<string[]>;
  getTaxonomy(userId: string): Promise<{ taskTypes: string[]; intents: string[]; riskFlags: string[] }>;
  getAccountStatus(userId: string): Promise<{ totalPrompts: number; lastIngestAt: string | null }>;
  getAnalyticsSummary(userId: string): Promise<{
    totalPrompts: number;
    bySite: Record<string, number>;
    averageClarity: number;
    recentTraits: string[];
  }>;

  // Extension sync observability + commands
  upsertExtensionStatus(userId: string, status: {
    deviceId: string;
    pending: number;
    failed: number;
    sending: number;
    lastRequestId?: string | null;
    lastSyncAt?: string | null;
    lastSyncError?: string | null;
  }): Promise<void>;
  getExtensionStatus(userId: string): Promise<Array<{
    deviceId: string;
    pending: number;
    failed: number;
    sending: number;
    lastRequestId: string | null;
    lastSyncAt: string | null;
    lastSyncError: string | null;
    updatedAt: string;
  }>>;
  enqueueExtensionCommand(userId: string, command: string, deviceId?: string | null, payload?: Record<string, any> | null): Promise<void>;
  consumeExtensionCommands(userId: string, deviceId: string): Promise<Array<{ id: string; command: string; payload: any }>>;
}

export class DatabaseStorage implements IStorage {
  async getPrompts(userId: string, params?: PromptsQueryParams) {
    const conditions: any[] = [eq(prompts.userId, userId), sql`${prompts.deletedAt} IS NULL`];
    if (params?.search) {
      conditions.push(ilike(prompts.promptText, `%${params.search}%`));
    }
    if (params?.site && params.site !== 'all') {
      conditions.push(eq(prompts.site, params.site));
    }
    if (params?.tag && params.tag !== 'all') {
      conditions.push(sql`${prompts.tags} @> ARRAY[${params.tag}]::text[]`);
    }
    if (params?.taskType && params.taskType !== 'all') {
      const json = JSON.stringify({ taxonomy: { taskType: [params.taskType] } });
      conditions.push(sql`${prompts.analysis} @> ${json}::jsonb`);
    }
    if (params?.intent && params.intent !== 'all') {
      const json = JSON.stringify({ taxonomy: { intent: [params.intent] } });
      conditions.push(sql`${prompts.analysis} @> ${json}::jsonb`);
    }
    if (params?.riskFlag && params.riskFlag !== 'all') {
      const json = JSON.stringify({ taxonomy: { riskFlags: [params.riskFlag] } });
      conditions.push(sql`${prompts.analysis} @> ${json}::jsonb`);
    }

    const limit = Math.min(Math.max(params?.limit ?? 24, 1), 200);
    const offset = Math.max(params?.offset ?? 0, 0);

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(prompts).where(and(eq(prompts.userId, userId), sql`${prompts.deletedAt} IS NULL`))
      .where(whereClause as any);

    const orderBy = params?.sortBy === 'clarity'
      ? desc(sql<number>`COALESCE((${prompts.analysis}->'scores'->>'clarity')::numeric, 0)`)
      : desc(prompts.createdAt);

    const items = await db
      .select()
      .from(prompts)
      .where(whereClause as any)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return { items, total: Number(count ?? 0), limit, offset };
  }

  async getPrompt(userId: string, id: string): Promise<Prompt | undefined> {
    const [prompt] = await db.select().from(prompts).where(and(eq(prompts.id, id), eq(prompts.userId, userId)));
    return prompt;
  }

    async createPrompt(userId: string, prompt: InsertPrompt): Promise<Prompt> {
    const __ingestNow = new Date();
    if (!prompt.analysis) {
      prompt.analysis = analyzePromptText(prompt.promptText) as any;
    }

    // Idempotency: (deviceId, clientEventId) should uniquely identify a client event.
    // If the same event is sent multiple times, return the existing row instead of creating duplicates.
    const inserted = await db.insert(prompts)
      .values({ ...prompt, userId })
      .onConflictDoNothing({ target: [prompts.deviceId, prompts.clientEventId] })
      .returning();

    if (inserted.length) {
      await db.update(users).set({ lastIngestAt: __ingestNow }).where(eq(users.id, userId));
      return inserted[0];
    }

    const [existing] = await db.select()
      .from(prompts)
      .where(and(
        eq(prompts.deviceId, prompt.deviceId),
        eq(prompts.clientEventId, prompt.clientEventId),
        eq(prompts.userId, userId),
      ));

    // Fallback: in the extremely unlikely case we still can't find it, insert normally
    if (existing) {
      await db.update(users).set({ lastIngestAt: __ingestNow }).where(eq(users.id, userId));
      return existing;
    }

    const [newPrompt] = await db.insert(prompts).values({ ...prompt, userId }).returning();
    await db.update(users).set({ lastIngestAt: __ingestNow }).where(eq(users.id, userId));
    return newPrompt;
  }

  async upsertExtensionStatus(userId: string, status: {
    deviceId: string;
    pending: number;
    failed: number;
    sending: number;
    lastRequestId?: string | null;
    lastSyncAt?: string | null;
    lastSyncError?: string | null;
  }): Promise<void> {
    const now = new Date();
    await db
      .insert(extensionStatus)
      .values({
        userId,
        deviceId: status.deviceId,
        pending: Math.max(0, Math.floor(status.pending || 0)),
        failed: Math.max(0, Math.floor(status.failed || 0)),
        sending: Math.max(0, Math.floor(status.sending || 0)),
        lastRequestId: status.lastRequestId ?? null,
        lastSyncAt: status.lastSyncAt ? new Date(status.lastSyncAt) : null,
        lastSyncError: status.lastSyncError ?? null,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [extensionStatus.userId, extensionStatus.deviceId],
        set: {
          pending: Math.max(0, Math.floor(status.pending || 0)),
          failed: Math.max(0, Math.floor(status.failed || 0)),
          sending: Math.max(0, Math.floor(status.sending || 0)),
          lastRequestId: status.lastRequestId ?? null,
          lastSyncAt: status.lastSyncAt ? new Date(status.lastSyncAt) : null,
          lastSyncError: status.lastSyncError ?? null,
          updatedAt: now,
        },
      });
  }

  async getExtensionStatus(userId: string) {
    const rows = await db
      .select()
      .from(extensionStatus)
      .where(eq(extensionStatus.userId, userId))
      .orderBy(desc(extensionStatus.updatedAt));
    return rows.map((r) => ({
      deviceId: r.deviceId,
      pending: r.pending,
      failed: r.failed,
      sending: r.sending,
      lastRequestId: r.lastRequestId ?? null,
      lastSyncAt: r.lastSyncAt ? r.lastSyncAt.toISOString() : null,
      lastSyncError: r.lastSyncError ?? null,
      updatedAt: r.updatedAt.toISOString(),
    }));
  }

  async enqueueExtensionCommand(userId: string, command: string, deviceId?: string | null, payload?: Record<string, any> | null): Promise<void> {
    await db.insert(extensionCommands).values({
      userId,
      deviceId: deviceId ?? null,
      command,
      payload: payload ?? null,
    });
  }

  async consumeExtensionCommands(userId: string, deviceId: string) {
    const now = new Date();
    const rows = await db
      .select()
      .from(extensionCommands)
      .where(and(
        eq(extensionCommands.userId, userId),
        sql`${extensionCommands.consumedAt} IS NULL`,
        sql`(${extensionCommands.deviceId} IS NULL OR ${extensionCommands.deviceId} = ${deviceId})`
      ))
      .orderBy(asc(extensionCommands.createdAt))
      .limit(20);

    if (!rows.length) return [];

    const ids = rows.map((r) => r.id);
    await db.update(extensionCommands).set({ consumedAt: now }).where(sql`${extensionCommands.id} = ANY(${ids}::uuid[])`);

    return rows.map((r) => ({ id: r.id, command: r.command, payload: r.payload }));
  }


  async updatePrompt(userId: string, id: string, updates: UpdatePromptRequest): Promise<Prompt> {
    const [updated] = await db.update(prompts)
      .set(updates)
      .where(and(eq(prompts.id, id), eq(prompts.userId, userId)))
      .returning();
    return updated;
  }

  async deletePrompt(userId: string, id: string): Promise<void> {
    await db.delete(prompts).where(and(eq(prompts.id, id), eq(prompts.userId, userId)));
  }

  async getTags(userId: string): Promise<string[]> {
    const rows = await db.select({ tags: prompts.tags }).from(prompts).where(and(eq(prompts.userId, userId), sql`${prompts.deletedAt} IS NULL`));
    const set = new Set<string>();
    for (const r of rows) {
      (r.tags ?? []).forEach((t) => {
        if (typeof t === 'string' && t.trim()) set.add(t.trim());
      });
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  async getTaxonomy(userId: string): Promise<{ taskTypes: string[]; intents: string[]; riskFlags: string[] }> {
    const rows = await db.select({ analysis: prompts.analysis }).from(prompts).where(and(eq(prompts.userId, userId), sql`${prompts.deletedAt} IS NULL`));
    const taskTypes = new Set<string>();
    const intents = new Set<string>();
    const riskFlags = new Set<string>();

    for (const r of rows) {
      const tax = (r.analysis as any)?.taxonomy;
      (tax?.taskType ?? []).forEach((x: string) => x && taskTypes.add(x));
      (tax?.intent ?? []).forEach((x: string) => x && intents.add(x));
      (tax?.riskFlags ?? []).forEach((x: string) => x && riskFlags.add(x));
    }

    return {
      taskTypes: Array.from(taskTypes).sort(),
      intents: Array.from(intents).sort(),
      riskFlags: Array.from(riskFlags).sort(),
    };
  }

  async getAccountStatus(userId: string): Promise<{ totalPrompts: number; lastIngestAt: string | null }> {
    const [user] = await db.select({ lastIngestAt: users.lastIngestAt }).from(users).where(eq(users.id, userId));
    const [row] = await db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(prompts).where(and(eq(prompts.userId, userId), sql`${prompts.deletedAt} IS NULL`));
    return { totalPrompts: row?.count ?? 0, lastIngestAt: user?.lastIngestAt ? user.lastIngestAt.toISOString() : null };
  }

  async getAnalyticsSummary(userId: string) {
    const allPrompts = await db.select().from(prompts).where(and(eq(prompts.userId, userId), sql`${prompts.deletedAt} IS NULL`));
    
    const totalPrompts = allPrompts.length;
    
    const bySite: Record<string, number> = {};
    let totalClarity = 0;
    const traitsSet = new Set<string>();

    allPrompts.forEach(p => {
      // Count by site
      bySite[p.site] = (bySite[p.site] || 0) + 1;
      
      // Sum clarity
      if (typeof p.analysis?.scores?.clarity === 'number') {
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


  async createUser(email: string, passwordHash: string, apiToken: string) {
    const [u] = await db.insert(users).values({ email, passwordHash, apiToken }).returning({
      id: users.id,
      email: users.email,
      apiToken: users.apiToken,
    });
    return u;
  }

  async getUserByEmail(email: string) {
    const [u] = await db.select({
      id: users.id,
      email: users.email,
      passwordHash: users.passwordHash,
      apiToken: users.apiToken,
    }).from(users).where(eq(users.email, email));
    return u;
  }

  async getUserByToken(apiToken: string) {
    const [u] = await db.select({
      id: users.id,
      email: users.email,
      apiToken: users.apiToken,
    }).from(users).where(eq(users.apiToken, apiToken));
    return u;
  }


  async getUserById(userId: string) {
    const [u] = await db.select({
      id: users.id,
      email: users.email,
      apiToken: users.apiToken,
    }).from(users).where(eq(users.id, userId));
    return u;
  }

  async rotateUserToken(userId: string, apiToken: string) {
    const [u] = await db.update(users).set({ apiToken }).where(eq(users.id, userId)).returning({
      apiToken: users.apiToken,
    });
    return u?.apiToken ?? apiToken;
  }

  async exportUserPromptsJson(userId: string) {
    const rows = await db.select().from(prompts).where(and(eq(prompts.userId, userId), sql`${prompts.deletedAt} IS NULL`)).orderBy(desc(prompts.createdAt));
    return { exportedAt: new Date().toISOString(), prompts: rows };
  }

  async exportUserPromptsCsv(userId: string) {
    const rows = await db.select().from(prompts).where(and(eq(prompts.userId, userId), sql`${prompts.deletedAt} IS NULL`)).orderBy(desc(prompts.createdAt));
    const header = ["id","createdAt","site","pageUrl","promptText","tags","deviceId","clientEventId"].join(",");
    const escape = (v: any) => {
      const s = String(v ?? "");
      const needs = /[",\n]/.test(s);
      const t = s.replace(/"/g, '""');
      return needs ? `"${t}"` : t;
    };
    const lines = rows.map(r => [
      r.id,
      r.createdAt?.toISOString?.() ?? r.createdAt,
      r.site,
      r.pageUrl,
      r.promptText,
      (r.tags ?? []).join("|"),
      r.deviceId,
      r.clientEventId
    ].map(escape).join(","));
    return [header, ...lines].join("\n");
  }

  async deleteAllUserData(userId: string) {
    await db.delete(prompts).where(eq(prompts.userId, userId));
    await db.delete(users).where(eq(users.id, userId));
  }

}

export const storage = new DatabaseStorage();
