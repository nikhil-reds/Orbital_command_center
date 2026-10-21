import Database from "better-sqlite3";
import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (password: string, salt: Buffer, length: number) => Promise<Buffer>;
const email = (process.env.ADMIN_EMAIL ?? "admin@reds.local").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? "Admin@2026!";

async function hashPassword(value: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(value, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

async function seed() {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("ADMIN_EMAIL must be a valid email address.");
  if (password.length < 8) throw new Error("ADMIN_PASSWORD must have at least 8 characters.");

  const dataDirectory = join(process.cwd(), "data");
  mkdirSync(dataDirectory, { recursive: true });
  const database = new Database(join(dataDirectory, "reds.db"));
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
      password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'OPERATOR',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const existing = database.prepare("SELECT id FROM users WHERE email = ?").get(email) as { id: string } | undefined;
  const passwordHash = await hashPassword(password);
  const name = "System Administrator";

  if (existing) {
    database.prepare("UPDATE users SET name = ?, password = ?, role = 'ADMIN', updatedAt = CURRENT_TIMESTAMP WHERE id = ?")
      .run(name, passwordHash, existing.id);
    console.log(`Updated administrator account: ${email}`);
  } else {
    database.prepare("INSERT INTO users (id, email, name, password, role) VALUES (?, ?, ?, ?, 'ADMIN')")
      .run(crypto.randomUUID(), email, name, passwordHash);
    console.log(`Created administrator account: ${email}`);
  }

  database.close();
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
