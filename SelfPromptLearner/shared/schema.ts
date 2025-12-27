import { pgTable, text, timestamp, boolean, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const prompts = pgTable("prompts", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  site: text("site").notNull(), // chatgpt, claude, gemini, etc.
  pageUrl: text("page_url").notNull(),
  conversationId: text("conversation_id"),
  promptText: text("prompt_text").notNull(),
  promptHash: text("prompt_hash").notNull(),
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
});

export const insertPromptSchema = createInsertSchema(prompts).omit({ 
  id: true, 
  createdAt: true,
  deletedAt: true 
});

export type Prompt = typeof prompts.$inferSelect;
export type InsertPrompt = z.infer<typeof insertPromptSchema>;

export type CreatePromptRequest = InsertPrompt;
export type UpdatePromptRequest = Partial<InsertPrompt>;

export interface PromptsQueryParams {
  search?: string;
  site?: string;
  sortBy?: 'date' | 'clarity';
}
