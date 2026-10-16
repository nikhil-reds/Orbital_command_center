import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { localDb } from "@/lib/local-db";
import { encodeAssignees, noteFor, progressFor, SEED_TASKS, STATUSES, TAG_COLORS, taskForApi, type TaskStatus } from "@/lib/tasks";

export const dynamic = "force-dynamic";

type TaskRow = { id: string; title: string; tag: string; tagColor: string; note: string; progress: number; status: string; position: number; assignees: string; createdAt: string; updatedAt: string };

function seedOnce() {
  if ((localDb.prepare("SELECT COUNT(*) AS count FROM tasks").get() as { count: number }).count) return;
  const insert = localDb.prepare("INSERT INTO tasks (id, title, tag, tagColor, note, progress, status, position, assignees) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  localDb.transaction(() => SEED_TASKS.forEach((task, position) => insert.run(randomUUID(), task.title, task.tag, task.tagColor, noteFor(task.status, task.progress), task.progress, task.status, position, encodeAssignees(task.assignees))))();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim();
  if (status && !STATUSES.includes(status as TaskStatus)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  if (!status && !q) seedOnce();
  const where = [status ? "status = ?" : "", q ? "LOWER(title) LIKE LOWER(?)" : ""].filter(Boolean).join(" AND ");
  const values = [status, q ? `%${q}%` : undefined].filter((value): value is string => typeof value === "string");
  const tasks = localDb.prepare(`SELECT * FROM tasks ${where ? `WHERE ${where}` : ""} ORDER BY status, position, createdAt`).all(...values) as TaskRow[];
  return NextResponse.json(tasks.map(taskForApi));
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  const status: TaskStatus = STATUSES.includes(body.status) ? body.status : "PENDING";
  const progress = progressFor(status, 0);
  const assignees = Array.isArray(body.assignees) ? body.assignees.filter((item: unknown): item is string => typeof item === "string").slice(0, 5) : [];
  const position = (localDb.prepare("SELECT COALESCE(MAX(position), -1) AS value FROM tasks WHERE status = ?").get(status) as { value: number }).value + 1;
  const task: TaskRow = { id: randomUUID(), title, tag: (typeof body.tag === "string" && body.tag.trim() ? body.tag.trim() : "GENERAL").toUpperCase().slice(0, 20), tagColor: TAG_COLORS.includes(body.tagColor) ? body.tagColor : "purple", note: noteFor(status, progress), progress, status, position, assignees: encodeAssignees(assignees), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  localDb.prepare("INSERT INTO tasks (id, title, tag, tagColor, note, progress, status, position, assignees, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(task.id, task.title, task.tag, task.tagColor, task.note, task.progress, task.status, task.position, task.assignees, task.createdAt, task.updatedAt);
  return NextResponse.json(taskForApi(task), { status: 201 });
}
