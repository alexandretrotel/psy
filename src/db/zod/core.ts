import { chats, summaries } from "@/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// chats table
export const chatSelectSchema = createSelectSchema(chats);
export const chatInsertSchema = createInsertSchema(chats);

export type ChatSelect = typeof chatSelectSchema;
export type ChatInsert = typeof chatInsertSchema;

// summaries table
export const summarySelectSchema = createSelectSchema(summaries);
export const summaryInsertSchema = createInsertSchema(summaries);

export type SummarySelect = typeof summarySelectSchema;
export type SummaryInsert = typeof summaryInsertSchema;
