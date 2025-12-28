import { pgTable, text, timestamp, boolean, jsonb, uuid, uniqueIndex, index, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";


export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  apiToken: text("api_token").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastIngestAt: timestamp("last_ingest_at"),
}, (t) => ({
  emailUniq: uniqueIndex("users_email_uniq").on(t.email),
  tokenUniq: uniqueIndex("users_token_uniq").on(t.apiToken),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

const promptMetaSchema = z
  .object({
    modelGuess: z.string().optional(),
    language: z.string().optional(),
    lengthChars: z.number(),
    lengthTokensEst: z.number(),
    isEdit: z.boolean(),
    submitMethod: z.string(),
  })
  .optional()
  .nullable();

const promptAnalysisSchema = z
  .object({
    taxonomy: z
      .object({
        taskType: z.array(z.string()),
        intent: z.array(z.string()),
        constraints: z.array(z.string()),
        riskFlags: z.array(z.string()),
      })
      .optional(),
    scores: z
      .object({
        clarity: z.number(),
        ambiguity: z.number(),
        reproducibility: z.number(),
      })
      .optional(),
    traits: z.array(z.string()).optional(),
    suggestions: z.array(z.string()).optional(),
  })
  .optional()
  .nullable();

export const prompts = pgTable("prompts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastIngestAt: timestamp("last_ingest_at"),
  site: text("site").notNull(), // chatgpt, claude, gemini, etc.
  pageUrl: text("page_url").notNull(),
  conversationId: text("conversation_id"),
  promptText: text("prompt_text").notNull(),
  promptHash: text("prompt_hash").notNull(),
  deviceId: text("device_id").notNull().default("unknown"),
  clientEventId: uuid("client_event_id").notNull().defaultRandom(),
  meta: jsonb("meta").$type<{
    modelGuess?: string;
    language?: string;
    lengthChars: number;
    lengthTokensEst: number;
    isEdit: boolean;
    submitMethod: string;
  }>(),
  tags: text("tags").array(),
  analysis: jsonb("analysis").$type<{
    taxonomy?: {
      taskType: string[];
      intent: string[];
      constraints: string[];
      riskFlags: string[];
    };
    scores?: {
      clarity: number;
      ambiguity: number;
      reproducibility: number;
    };
    traits?: string[];
    suggestions?: string[];
  }>(),
  isFavorite: boolean("is_favorite").default(false),
  isSynced: boolean("is_synced").default(false),
  deletedAt: timestamp("deleted_at"),
}, (t) => ({
  deviceEventUniq: uniqueIndex("prompts_device_event_uniq").on(t.deviceId, t.clientEventId),
  userCreatedIdx: index("prompts_user_created_idx").on(t.userId, t.createdAt),
  userSiteIdx: index("prompts_user_site_idx").on(t.userId, t.site),
  userTaskIdx: index("prompts_user_task_idx").on(t.userId, t.taskType),
  userIntentIdx: index("prompts_user_intent_idx").on(t.userId, t.intent),
  tagsGinIdx: index("prompts_tags_gin_idx").using("gin", t.tags),
}));

export const insertPromptSchema = createInsertSchema(prompts).omit({ 
  id: true, 
  createdAt: true,
  deletedAt: true 
}).omit({ userId: true }).extend({
  meta: promptMetaSchema,
  analysis: promptAnalysisSchema,
});

export type Prompt = typeof prompts.$inferSelect;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;

export type CreatePromptRequest = InsertPrompt;
export type UpdatePromptRequest = Partial<InsertPrompt>;

export interface PromptsQueryParams {
  search?: string;
  site?: string;
  tag?: string;
  taskType?: string;
  intent?: string;
  riskFlag?: string;
  sortBy?: 'date' | 'clarity';
  limit?: number;
  offset?: number;
}


export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Extension status & commands (for “truthful sync status” across devices)
export const extensionStatus = pgTable("extension_status", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  deviceId: text("device_id").notNull(),
  pending: integer("pending").notNull().default(0),
  failed: integer("failed").notNull().default(0),
  sending: integer("sending").notNull().default(0),
  lastRequestId: text("last_request_id"),
  lastSyncAt: timestamp("last_sync_at"),
  lastSyncError: text("last_sync_error"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  userDeviceUniq: uniqueIndex("ext_status_user_device_uniq").on(t.userId, t.deviceId),
  userUpdatedIdx: index("ext_status_user_updated_idx").on(t.userId, t.updatedAt),
}));

export const extensionCommands = pgTable("extension_commands", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  deviceId: text("device_id"), // null means broadcast
  command: text("command").notNull(), // e.g., retry_failed
  payload: jsonb("payload").$type<Record<string, any> | null>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  consumedAt: timestamp("consumed_at"),
}, (t) => ({
  userCreatedIdx: index("ext_cmd_user_created_idx").on(t.userId, t.createdAt),
  userDeviceIdx: index("ext_cmd_user_device_idx").on(t.userId, t.deviceId),
}));

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
