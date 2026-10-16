import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const globalDb = globalThis as unknown as { localDb?: Database.Database };

function createDatabase() {
  const directory = join(process.cwd(), "data");
  mkdirSync(directory, { recursive: true });
  const db = new Database(join(directory, "reds.db"));
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'OPERATOR',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY, title TEXT NOT NULL, tag TEXT NOT NULL DEFAULT 'GENERAL',
      tagColor TEXT NOT NULL DEFAULT 'purple', note TEXT NOT NULL DEFAULT '', progress INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'PENDING', position INTEGER NOT NULL DEFAULT 0, assignees TEXT NOT NULL DEFAULT '[]',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return db;
}

export const localDb = globalDb.localDb ?? createDatabase();
if (process.env.NODE_ENV !== "production") globalDb.localDb = localDb;
