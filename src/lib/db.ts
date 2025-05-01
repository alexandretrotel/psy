import Dexie, { type EntityTable } from "dexie";

type Message = {
  user: string;
  ai: string;
};

interface Chat {
  id?: number;
  date: string; // YYYY-MM-DD
  messages: Message[];
  createdAt: Date;
}

interface Summary {
  id?: number;
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

export type { Chat, Summary, Message };
export { db };
