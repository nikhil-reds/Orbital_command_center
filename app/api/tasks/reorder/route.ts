import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@/lib/generated/prisma/enums";
import { STATUSES } from "@/lib/tasks";

// POST /api/tasks/reorder { status: "PENDING", orderedIds: ["task-id", ...] }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !STATUSES.includes(body.status as TaskStatus) || !Array.isArray(body.orderedIds) || body.orderedIds.some((id: unknown) => typeof id !== "string")) {
    return NextResponse.json({ error: "Provide a valid status and orderedIds array" }, { status: 400 });
  }

  const status = body.status as TaskStatus;
  const orderedIds = body.orderedIds as string[];
  if (new Set(orderedIds).size !== orderedIds.length) return NextResponse.json({ error: "Task ids must be unique" }, { status: 400 });

  try {
    const tasks = await prisma.task.findMany({ where: { id: { in: orderedIds } }, select: { id: true, status: true } });
    if (tasks.length !== orderedIds.length || tasks.some((task) => task.status !== status)) return NextResponse.json({ error: "All tasks must exist in the selected status" }, { status:400 });
    await prisma.$transaction(orderedIds.map((id, position) => prisma.task.update({ where: { id }, data: { position } })));
    return NextResponse.json({ ok: true, status, orderedIds });
  } catch {
    return NextResponse.json({ error: "Task storage is unavailable" }, { status: 503 });
  }
}
