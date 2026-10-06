import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@/lib/generated/prisma/enums";
import { noteFor, progressFor, STATUSES, TAG_COLORS } from "@/lib/tasks";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params;
  const task = await prisma.task.findUnique({ where: { id } });
  return task ? NextResponse.json(task) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

// PATCH /api/tasks/:id  { title?, tag?, tagColor?, assignees?, progress?, status?, position? }
// Changing status (drag and drop) moves the task to the end of that column unless position is given.
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const current = await prisma.task.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (typeof body.title === "string" && body.title.trim()) data.title = body.title.trim();
  if (typeof body.tag === "string" && body.tag.trim()) data.tag = body.tag.trim().toUpperCase().slice(0, 20);
  if (TAG_COLORS.includes(body.tagColor)) data.tagColor = body.tagColor;
  if (Array.isArray(body.assignees)) data.assignees = body.assignees.filter((a: unknown) => typeof a === "string").slice(0, 5);

  let status: TaskStatus = current.status;
  let progress = current.progress;
  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    status = body.status;
    if (status !== current.status) {
      progress = progressFor(status, current.progress);
      const last = await prisma.task.aggregate({ where: { status }, _max: { position: true } });
      data.status = status;
      data.position = (last._max.position ?? -1) + 1;
    }
  }
  if (typeof body.progress === "number" && body.status === undefined) {
    progress = Math.min(100, Math.max(0, Math.round(body.progress)));
  }
  if (typeof body.position === "number") data.position = Math.max(0, Math.round(body.position));
  data.progress = progress;
  data.note = noteFor(status, progress);

  const task = await prisma.task.update({ where: { id }, data });
  return NextResponse.json(task);
}

export async function DELETE(_: Request, { params }: Ctx) {
  const { id } = await params;
  try {
    await prisma.task.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
