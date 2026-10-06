import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DUMMY_HASH, setSessionCookie, verifyPassword } from "@/lib/auth";

// POST /api/auth/signin  { email, password }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  const ok = await verifyPassword(password, user?.password ?? DUMMY_HASH);
  if (!user || !ok) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  await setSessionCookie(user.id);
  return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role });
}
