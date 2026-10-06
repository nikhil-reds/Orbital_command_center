import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@/lib/generated/prisma/enums";
import { noteFor, progressFor, SEED_TASKS, STATUSES, TAG_COLORS } from "@/lib/tasks";

export const dynamic = "force-dynamic";

// First run: seed demo tasks so the board is not empty. Concurrent first requests share one seeding run.
let seeding: Promise<void> | null = null;
function seedOnce() {
  seeding ??= (async () => {
    if ((await prisma.task.count()) === 0) {
      await prisma.task.createMany({
        data: SEED_TASKS.map((t, position) => ({ ...t, position, note: noteFor(t.status, t.progress) })),
      });
    }
  })().finally(() => { seeding = null; });
  return seeding;
}

// GET /api/tasks?status=PENDING&q=search
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim();

  if (status && !STATUSES.includes(status as TaskStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (!status && !q) await seedOnce();

  const tasks = await prisma.task.findMany({
    where: {
      ...(status ? { status: status as TaskStatus } : {}),
      ...(q ? { title: { contains: q, mode: "insensitive" as const } } : {}),
    },
    orderBy: [{ status: "asc" }, { position: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(tasks);
}

// POST /api/tasks  { title, tag?, tagColor?, status?, assignees? }
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const status: TaskStatus = STATUSES.includes(body.status) ? body.status : "PENDING";
  const progress = progressFor(status, 0);
  const last = await prisma.task.aggregate({ where: { status }, _max: { position: true } });

  const task = await prisma.task.create({
    data: {
      title,
      tag: (typeof body.tag === "string" && body.tag.trim() ? body.tag.trim() : "GENERAL").toUpperCase().slice(0, 20),
      tagColor: TAG_COLORS.includes(body.tagColor) ? body.tagColor : "purple",
      assignees: Array.isArray(body.assignees) ? body.assignees.filter((a: unknown) => typeof a === "string").slice(0, 5) : [],
      status,
      progress,
      note: noteFor(status, progress),
      position: (last._max.position ?? -1) + 1,
    },
  });
  return NextResponse.json(task, { status: 201 });
}
