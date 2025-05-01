import { UIMessage } from "ai";
import Dexie, { type EntityTable } from "dexie";

interface Chat {
  id?: string;
  date: string; // YYYY-MM-DD
  messages: UIMessage[];
  createdAt: Date;
}

interface Summary {
  id?: string;
  summary: string;
  generatedAt: Date;
}

const db = new Dexie("PsyDB") as Dexie & {
  chats: EntityTable<Chat, "id">;
  summaries: EntityTable<Summary, "id">;
};

db.version(1).stores({
  chats: "++id, date, messages, createdAt",
  summaries: "++id, summary, generatedAt",
});

export type { Chat, Summary };
export { db };
