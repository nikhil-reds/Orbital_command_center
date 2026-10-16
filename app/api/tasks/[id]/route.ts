import { NextResponse } from "next/server";
import { localDb } from "@/lib/local-db";
import { encodeAssignees, noteFor, progressFor, STATUSES, TAG_COLORS, taskForApi, type TaskStatus } from "@/lib/tasks";

type Ctx = { params: Promise<{ id: string }> };
type TaskRow = { id: string; title: string; tag: string; tagColor: string; note: string; progress: number; status: string; position: number; assignees: string; createdAt: string; updatedAt: string };
const getTask = (id: string) => localDb.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as TaskRow | undefined;

export async function GET(_: Request, { params }: Ctx) { const task = getTask((await params).id); return task ? NextResponse.json(taskForApi(task)) : NextResponse.json({ error: "Not found" }, { status: 404 }); }

export async function PATCH(req: Request, { params }: Ctx) {
  const id = (await params).id;
  const body = await req.json().catch(() => null);
  const current = getTask(id);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (body.status !== undefined && !STATUSES.includes(body.status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const status = (body.status ?? current.status) as TaskStatus;
  const progress = typeof body.progress === "number" ? Math.min(100, Math.max(0, Math.round(body.progress))) : status !== current.status ? progressFor(status, current.progress) : current.progress;
  const position = typeof body.position === "number" ? Math.max(0, Math.round(body.position)) : status !== current.status ? (localDb.prepare("SELECT COALESCE(MAX(position), -1) AS value FROM tasks WHERE status = ?").get(status) as { value: number }).value + 1 : current.position;
  const next = { title: typeof body.title === "string" && body.title.trim() ? body.title.trim() : current.title, tag: typeof body.tag === "string" && body.tag.trim() ? body.tag.trim().toUpperCase().slice(0, 20) : current.tag, tagColor: TAG_COLORS.includes(body.tagColor) ? body.tagColor : current.tagColor, assignees: Array.isArray(body.assignees) ? encodeAssignees(body.assignees.filter((item: unknown): item is string => typeof item === "string").slice(0, 5)) : current.assignees };
  localDb.prepare("UPDATE tasks SET title=?, tag=?, tagColor=?, note=?, progress=?, status=?, position=?, assignees=?, updatedAt=? WHERE id=?").run(next.title, next.tag, next.tagColor, noteFor(status, progress), progress, status, position, next.assignees, new Date().toISOString(), id);
  return NextResponse.json(taskForApi(getTask(id)!));
}

export const PUT = PATCH;
export async function DELETE(_: Request, { params }: Ctx) { const id = (await params).id; if (!getTask(id)) return NextResponse.json({ error: "Not found" }, { status: 404 }); localDb.prepare("DELETE FROM tasks WHERE id = ?").run(id); return NextResponse.json({ ok: true }); }
