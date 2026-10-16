"use client";

import React, { useCallback, useEffect, useState } from "react";
import { TodoWorkspaceFrame } from "./workspace-frame";

type Status = "pending" | "progress" | "review" | "completed";
type Filter = "all" | Status;
type TagColor = "purple" | "orange" | "pink" | "green";

interface Task {
  id: string;
  tag: string;
  tagColor: TagColor;
  title: string;
  note: string;
  progress: number;
  status: Status;
  people: string[];
}

interface ApiTask {
  id: string;
  tag: string;
  tagColor: TagColor;
  title: string;
  note: string;
  progress: number;
  status: "PENDING" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  assignees: string[];
}

const TO_UI: Record<ApiTask["status"], Status> = { PENDING: "pending", IN_PROGRESS: "progress", REVIEW: "review", COMPLETED: "completed" };
const TO_API: Record<Status, ApiTask["status"]> = { pending: "PENDING", progress: "IN_PROGRESS", review: "REVIEW", completed: "COMPLETED" };

const fromApi = (t: ApiTask): Task => ({ id: t.id, tag: t.tag, tagColor: t.tagColor, title: t.title, note: t.note, progress: t.progress, status: TO_UI[t.status], people: t.assignees });

const COLUMNS: { id: Status; title: string; dot: string; bar: string }[] = [
  { id: "pending", title: "Pending", dot: "#8b5cf6", bar: "#8b5cf6" },
  { id: "progress", title: "In Progress", dot: "#0ea5e9", bar: "#0ea5e9" },
  { id: "review", title: "Review", dot: "#f59e0b", bar: "#f59e0b" },
  { id: "completed", title: "Completed", dot: "#10b981", bar: "#10b981" },
];

const TAGS = {
  purple: { bg: "#ede9fe", fg: "#6d28d9" },
  orange: { bg: "#ffedd5", fg: "#c2410c" },
  pink: { bg: "#fce7f3", fg: "#be185d" },
  green: { bg: "#d1fae5", fg: "#047857" },
};

const AVATARS = ["#27272a", "#52525b", "#71717a", "#a1a1aa"];

const DEMO_TASKS: Task[] = [
  { id: "demo-1", tag: "DESIGN", tagColor: "purple", title: "Finalize the command-center dashboard layout", note: "Ready to start", progress: 0, status: "pending", people: ["AL", "MK"] },
  { id: "demo-2", tag: "RESEARCH", tagColor: "pink", title: "Review navigation patterns for mission control", note: "Ready to start", progress: 0, status: "pending", people: ["RS"] },
  { id: "demo-3", tag: "FRONTEND", tagColor: "orange", title: "Build responsive task board interactions", note: "65% completed", progress: 65, status: "progress", people: ["JD", "AL"] },
  { id: "demo-4", tag: "API", tagColor: "orange", title: "Connect live mission telemetry feed", note: "40% completed", progress: 40, status: "progress", people: ["MK", "TJ"] },
  { id: "demo-5", tag: "QA", tagColor: "pink", title: "Validate task flow across screen sizes", note: "Under review", progress: 90, status: "review", people: ["RS", "JD"] },
  { id: "demo-6", tag: "CONTENT", tagColor: "green", title: "Publish operations quick-start guide", note: "Task finished", progress: 100, status: "completed", people: ["TJ", "AL"] },
];

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<Status | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<{ title: string; tag: string; tagColor: TagColor; status: Status }>({ title: "", tag: "", tagColor: "purple", status: "pending" });

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks", { cache: "no-store" });
      if (!res.ok) throw new Error();
      setTasks(((await res.json()) as ApiTask[]).map(fromApi));
      setError(null);
    } catch {
      setTasks(DEMO_TASKS);
      setDemoMode(true);
      setError("Showing demo tasks — local API is unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const drop = async (status: Status) => {
    const id = dragId;
    setDragId(null);
    setOverCol(null);
    const task = tasks.find(t => t.id === id);
    if (!id || !task || task.status === status) return;

    const prev = tasks;
    setTasks(p => p.map(t => (t.id === id ? { ...t, status } : t))); // optimistic
    if (demoMode) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: TO_API[status] }) });
      if (!res.ok) throw new Error();
      const updated = fromApi(await res.json());
      setTasks(p => p.map(t => (t.id === id ? updated : t)));
    } catch {
      setTasks(prev);
      setError("Could not move task");
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (demoMode) {
      setTasks(p => [...p, { id: `demo-${crypto.randomUUID()}`, title: form.title.trim(), tag: form.tag.trim().toUpperCase() || "GENERAL", tagColor: form.tagColor, status: form.status, progress: form.status === "completed" ? 100 : form.status === "review" ? 90 : form.status === "progress" ? 50 : 0, note: form.status === "completed" ? "Task finished" : form.status === "review" ? "Under review" : form.status === "progress" ? "50% completed" : "Ready to start", people: ["RC"] }]);
      setForm({ title: "", tag: "", tagColor: "purple", status: "pending" });
      setAdding(false);
      return;
    }
    try {
      const res = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: form.title, tag: form.tag, tagColor: form.tagColor, status: TO_API[form.status] }) });
      if (!res.ok) throw new Error();
      const created = fromApi(await res.json());
      setTasks(p => [...p, created]);
      setForm({ title: "", tag: "", tagColor: "purple", status: "pending" });
      setAdding(false);
      setError(null);
    } catch {
      setError("Could not create task");
    }
  };

  const removeTask = async (id: string) => {
    const prev = tasks;
    setTasks(p => p.filter(t => t.id !== id));
    if (demoMode) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setTasks(prev);
      setError("Could not delete task");
    }
  };

  const visibleCols = COLUMNS.filter(c => filter === "all" || c.id === filter);
  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
  ];

  const total = tasks.length;
  const done = tasks.filter(t => t.status === "completed").length;
  const font = { fontFamily: "var(--font-body), sans-serif" };
  const inputStyle = { ...font, background: "#ffffff", border: "1px solid #d4d4d8", color: "#18181b" };

  return (
    <TodoWorkspaceFrame onCreate={() => setAdding(true)}>
        <div className="todo-page todo-monochrome flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <p style={{ ...font, fontSize: 10, letterSpacing: "0.16em", color: "#71717a", margin: 0 }}>ADMINISTRATION / WORK MANAGEMENT</p>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 600, letterSpacing: "-.04em", color: "#18181b", lineHeight: 1.1, margin: 0 }}>Task board</h1>
          <p style={{ ...font, fontSize: 12, color: "#71717a", margin: 0 }}>{done} of {total} tasks completed</p>
        </div>
        <button
          onClick={() => setAdding(a => !a)}
          className="admin-button"
          style={{ ...font }}
        >
          {adding ? "× CANCEL" : "+ NEW TASK"}
        </button>
      </header>

      {error && (
        <div className="rounded px-4 py-2 text-xs" style={{ ...font, background: "#27272a", border: "1px solid #27272a", color: "#fff" }}>
          {error}
        </div>
      )}

      {adding && (
        <form onSubmit={createTask} className="flex flex-wrap items-center gap-3 rounded-lg p-3" style={{ background: "#fff", border: "1px solid #e4e4e7" }}>
          <input autoFocus required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Task title" className="flex-1 min-w-[220px] px-3 py-2 rounded text-xs outline-none" style={inputStyle} />
          <input value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder="Tag (e.g. DESIGN)" className="w-36 px-3 py-2 rounded text-xs outline-none" style={inputStyle} />
          <select value={form.tagColor} onChange={e => setForm(f => ({ ...f, tagColor: e.target.value as TagColor }))} className="px-3 py-2 rounded text-xs outline-none" style={inputStyle}>
            {(Object.keys(TAGS) as TagColor[]).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))} className="px-3 py-2 rounded text-xs outline-none" style={inputStyle}>
            {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <button type="submit" className="admin-button" style={{ ...font }}>ADD</button>
        </form>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: "#fff", border: "1px solid #e4e4e7" }}>
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-3 py-1.5 rounded-md text-[10px] font-semibold tracking-[0.12em] uppercase transition-all"
              style={{ ...font, background: filter === f.id ? "#18181b" : "transparent", color: filter === f.id ? "#fff" : "#71717a" }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search tasks..."
          className="px-3 py-2 rounded-lg text-xs outline-none transition-colors"
          style={{ ...font, width: 220, background: "#fff", border: "1px solid #d4d4d8", color: "#18181b" }}
        />
      </div>

      {/* Board */}
      <div className="board-scroll overflow-auto pb-5 pr-2" style={{ scrollSnapType: "x proximity", maxHeight: "max(520px, calc(100vh - 260px))" }}>
        <div className="flex gap-4 items-stretch" style={{ width: "max-content", minWidth: "100%" }}>
          {visibleCols.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id && t.title.toLowerCase().includes(query.toLowerCase()));
            const active = overCol === col.id;
            return (
              <section
                key={col.id}
                onDragOver={e => { e.preventDefault(); setOverCol(col.id); }}
                onDragLeave={() => setOverCol(o => (o === col.id ? null : o))}
                onDrop={() => drop(col.id)}
                className="flex flex-col gap-3 rounded-xl p-3 transition-all shrink-0"
                style={{
                  width: 260,
                  flex: "1 0 260px",
                  scrollSnapAlign: "start",
                  minHeight: 360,
                  background: active ? "rgba(11,218,81,.08)" : "rgba(35,31,32,.45)",
                  border: active ? "1px dashed rgba(51,245,117,.6)" : "1px solid rgba(11,218,81,.12)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full" style={{ width: 9, height: 9, background: col.dot, boxShadow: `0 0 10px ${col.dot}` }} />
                    <h2 style={{ ...font, fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", color: "#F6F6F3", textTransform: "uppercase" }}>{col.title}</h2>
                  </div>
                  <span className="rounded-full px-2 py-0.5 text-[10px]" style={{ ...font, background: "rgba(246,246,243,.08)", color: "rgba(246,246,243,.7)" }}>
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {colTasks.map(t => (
                    <article
                      key={t.id}
                      draggable
                      onDragStart={() => setDragId(t.id)}
                      onDragEnd={() => { setDragId(null); setOverCol(null); }}
                      className="flex flex-col gap-2.5 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all hover:-translate-y-0.5 hover:border-[rgba(51,245,117,.4)]"
                      style={{ background: "rgba(51,53,56,.7)", border: "1px solid rgba(11,218,81,.15)", boxShadow: "0 4px 14px rgba(0,0,0,.3)", opacity: dragId === t.id ? 0.4 : 1 }}
                    >
                      <div className="flex items-start justify-between">
                        <span className="rounded px-2 py-0.5 text-[8px] font-bold tracking-[0.12em]" style={{ ...font, background: TAGS[t.tagColor].bg, color: TAGS[t.tagColor].fg }}>
                          {t.tag}
                        </span>
                        <button onClick={() => removeTask(t.id)} aria-label="Delete task" className="text-[14px] leading-none text-[rgba(246,246,243,.35)] hover:text-red-400 transition-colors">×</button>
                      </div>
                      <p className="text-[12px] text-[#F6F6F3]" style={{ lineHeight: 1.45 }}>{t.title}</p>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[9px]" style={{ ...font, color: "rgba(246,246,243,.55)" }}>
                          <span>{t.note}</span>
                          <span>{t.progress}%</span>
                        </div>
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(246,246,243,.1)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${t.progress}%`, background: col.bar }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2.5" style={{ borderTop: "1px solid rgba(11,218,81,.1)" }}>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full" style={{ width: 12, height: 12, background: t.status === "completed" ? "#22c55e" : "#0ea5e9" }} />
                          <span className="text-red-500 text-xs font-bold leading-none">⌃</span>
                        </div>
                        <div className="flex">
                          {t.people.map((p, i) => (
                            <span
                              key={p}
                              className="rounded-full text-[8px] font-bold text-white flex items-center justify-center border-2 border-[#333538]"
                              style={{ width: 20, height: 20, marginLeft: i ? -6 : 0, background: AVATARS[(p.charCodeAt(0) + i) % AVATARS.length] }}
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                  {colTasks.length === 0 && (
                    <div className="rounded-xl py-6 text-center text-[9px] tracking-[0.15em]" style={{ ...font, border: "1px dashed rgba(11,218,81,.2)", color: "rgba(246,246,243,.35)" }}>
                      {loading ? "LOADING..." : "DROP TASKS HERE"}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
        </div>
    </TodoWorkspaceFrame>
  );
}
