import { pgTable, text, timestamp, boolean, jsonb, uuid, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";


export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  apiToken: text("api_token").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;

