import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { localDb } from "@/lib/local-db";

export const dynamic = "force-dynamic";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

// GET /api/users -> registered users (requires an authenticated session)
export async function GET() {
  if (!await getCurrentUser()) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const users = localDb.prepare(`
    SELECT id, name, email, role, createdAt, updatedAt
    FROM users
    ORDER BY createdAt DESC
  `).all() as UserRecord[];

  return NextResponse.json({ users });
}

// POST /api/users -> create a user with an email and password
export async function POST(request: Request) {
  if (!await getCurrentUser()) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  if (password.length > 128) return NextResponse.json({ error: "Password is too long" }, { status: 400 });
  if (localDb.prepare("SELECT id FROM users WHERE email = ?").get(email)) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const user = { id: randomUUID(), name: email.split("@")[0].slice(0, 80) || "New user", email, role: "OPERATOR" };
  localDb.prepare("INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)")
    .run(user.id, user.name, user.email, await hashPassword(password), user.role);

  return NextResponse.json(user, { status: 201 });
}
