"use client";

import React, { useState } from "react";

type Status = "pending" | "progress" | "review" | "completed";
type Filter = "all" | Status;

interface Task {
  id: string;
  tag: string;
  tagColor: "purple" | "orange" | "pink" | "green";
  title: string;
  note: string;
  progress: number;
  status: Status;
  people: string[];
}

const COLUMNS: { id: Status; title: string; dot: string; bar: string }[] = [
  { id: "pending", title: "Pending", dot: "#6366f1", bar: "#6366f1" },
  { id: "progress", title: "In Progress", dot: "#f59e0b", bar: "#f59e0b" },
  { id: "review", title: "Review", dot: "#ef4444", bar: "#ef4444" },
  { id: "completed", title: "Completed", dot: "#22c55e", bar: "#22c55e" },
];

const TAGS = {
  purple: { bg: "#ede9fe", fg: "#6d28d9" },
  orange: { bg: "#fef3c7", fg: "#b45309" },
  pink: { bg: "#fce7f3", fg: "#be185d" },
  green: { bg: "#dcfce7", fg: "#15803d" },
};

const AVATARS = ["#f97316", "#8b5cf6", "#0ea5e9", "#ec4899"];

const INITIAL: Task[] = [
  { id: "1", tag: "ILLUSTRATION", tagColor: "purple", title: "Add one more type of illustration on the home screen", note: "Not started yet", progress: 0, status: "pending", people: ["AL", "JD", "MK"] },
  { id: "2", tag: "UX DESIGN", tagColor: "purple", title: "Create designs for admin, and for user web and android platform", note: "Not started yet", progress: 0, status: "pending", people: ["RS", "TJ"] },
  { id: "3", tag: "PROTOTYPE", tagColor: "purple", title: "Create prototype for admin, and for user web and android platform", note: "Not started yet", progress: 0, status: "pending", people: ["JD", "AL"] },
  { id: "4", tag: "WIREFRAMES", tagColor: "orange", title: "Create Wireframes for admin, and for user web and android platform", note: "50% completed", progress: 50, status: "progress", people: ["MK", "RS", "AL"] },
  { id: "5", tag: "ARCHITECTURE", tagColor: "orange", title: "Create information architecture for admin, and for user web and android", note: "60% completed", progress: 60, status: "progress", people: ["TJ", "JD"] },
  { id: "6", tag: "TASK FLOW", tagColor: "pink", title: "Create Task Flow for admin, and for user web and android platform", note: "Under Review", progress: 90, status: "review", people: ["AL", "MK", "RS"] },
  { id: "7", tag: "USER PERSONAS", tagColor: "green", title: "Create Personas for all type of users on the base of research data", note: "Task Finished", progress: 100, status: "completed", people: ["JD", "TJ", "AL"] },
  { id: "8", tag: "USER STORIES", tagColor: "green", title: "Create User Stories for admin, and for user web and android platform", note: "Task Finished", progress: 100, status: "completed", people: ["RS", "MK"] },
];

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<Status | null>(null);

  const drop = (status: Status) => {
    if (!dragId) return;
    setTasks(prev =>
      prev.map(t =>
        t.id === dragId
          ? { ...t, status, progress: status === "completed" ? 100 : status === "pending" ? 0 : t.progress, note: status === "completed" ? "Task Finished" : status === "pending" ? "Not started yet" : status === "review" ? "Under Review" : `${t.progress}% completed` }
          : t
      )
    );
    setDragId(null);
    setOverCol(null);
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "0.1em", color: "#F6F6F3", textShadow: "0 0 20px rgba(51,245,117,0.45)", lineHeight: 1.1 }}>
            TASK BOARD
          </h1>
          <p style={{ ...font, fontSize: 10, letterSpacing: "0.16em", color: "rgba(246,246,243,.6)" }}>
            {done} OF {total} DIRECTIVES COMPLETED
          </p>
        </div>
        <button
          className="px-4 py-2 rounded text-[10px] font-bold tracking-[0.18em] text-[#231F20] transition-all hover:shadow-[0_0_18px_rgba(11,218,81,0.7)]"
          style={{ ...font, background: "linear-gradient(90deg,#0BDA51,#33F575)" }}
        >
          + NEW TASK
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: "rgba(35,31,32,.6)", border: "1px solid rgba(11,218,81,.2)" }}>
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-3 py-1.5 rounded-md text-[10px] font-semibold tracking-[0.12em] uppercase transition-all"
              style={{ ...font, background: filter === f.id ? "#0BDA51" : "transparent", color: filter === f.id ? "#231F20" : "rgba(246,246,243,.7)" }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search tasks..."
          className="px-3 py-2 rounded-lg text-xs text-[#F6F6F3] outline-none focus:border-[#33F575] transition-colors"
          style={{ ...font, width: 220, background: "rgba(35,31,32,.6)", border: "1px solid rgba(11,218,81,.2)" }}
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
                      <span className="self-start rounded px-2 py-0.5 text-[8px] font-bold tracking-[0.12em]" style={{ ...font, background: TAGS[t.tagColor].bg, color: TAGS[t.tagColor].fg }}>
                        {t.tag}
                      </span>
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
                      DROP TASKS HERE
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
