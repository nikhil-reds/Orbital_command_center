import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@/lib/generated/prisma/enums";
import { STATUSES } from "@/lib/tasks";

export async function GET() {
  try {
    const groups = await prisma.task.groupBy({ by: ["status"], _count: { _all: true } });
    const byStatus = Object.fromEntries(STATUSES.map((status) => [status, 0])) as Record<TaskStatus, number>;
    for (const group of groups) byStatus[group.status] = group._count._all;
    const total = Object.values(byStatus).reduce((sum, value) => sum + value, 0);
    return NextResponse.json({ total, completed: byStatus.COMPLETED, byStatus });
  } catch {
    return NextResponse.json({ error: "Task storage is unavailable" }, { status: 503 });
  }
}
