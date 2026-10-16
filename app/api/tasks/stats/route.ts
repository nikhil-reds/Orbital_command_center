import { NextResponse } from "next/server";
import { localDb } from "@/lib/local-db";
import { STATUSES, type TaskStatus } from "@/lib/tasks";
export async function GET() { const byStatus = Object.fromEntries(STATUSES.map((status) => [status, 0])) as Record<TaskStatus, number>; const groups = localDb.prepare("SELECT status, COUNT(*) AS count FROM tasks GROUP BY status").all() as { status: string; count: number }[]; groups.forEach((group) => { if (STATUSES.includes(group.status as TaskStatus)) byStatus[group.status as TaskStatus] = group.count; }); const total = Object.values(byStatus).reduce((sum, value) => sum + value, 0); return NextResponse.json({ total, completed: byStatus.COMPLETED, byStatus }); }
