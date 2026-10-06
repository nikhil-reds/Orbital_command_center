import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/auth/me  -> current user, or 401
export async function GET() {
  const user = await getCurrentUser();
  return user ? NextResponse.json(user) : NextResponse.json({ error: "Not signed in" }, { status: 401 });
}
