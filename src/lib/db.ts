import Dexie, { Table } from "dexie";

export interface Chat {
  id?: number;
  date: string; // YYYY-MM-DD
  messages: { user: string; ai: string }[];
  createdAt: Date;
}

export interface Summary {
  id?: number;
  summary: string;
  generatedAt: Date;
}

class PsyDB extends Dexie {
  chats!: Table<Chat>;
  summaries!: Table<Summary>;

  constructor() {
    super("PsyDB");
    this.version(1).stores({
      chats: "++id,date,messages,createdAt",
      summaries: "++id,summary,generatedAt",
    });
  }
}

export const db = new PsyDB();
