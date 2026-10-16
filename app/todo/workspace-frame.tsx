"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const workspaceLinks = [
  ["▤", "Backlog", "/todo/backlog"],
  ["▦", "Board", "/todo"],
  ["⌁", "Reports", "/todo/reports"],
  ["♧", "Resources", "/todo/resources"],
];

const projectLinks = [
  ["◈", "Components", "/todo/components"],
  ["◇", "Issues", "/todo/issues"],
  ["⌘", "Repository", "/todo/repository"],
];

export function TodoWorkspaceFrame({ children, onCreate }: { children: ReactNode; onCreate?: () => void }) {
  const pathname = usePathname();
  const nav = (items: string[][]) => items.map(([icon, label, href]) => (
    <Link key={href} href={href} className={pathname === href ? "active" : ""}>
      {icon} <span>{label}</span>
    </Link>
  ));

  return <div className="todo-shell">
    <aside className="todo-rail" aria-label="Primary navigation">
      <Link href="/todo" className="todo-rail-logo" aria-label="REDS board">R</Link>
      <Link href="/todo" aria-label="Boards" className="active">▦</Link>
      <button aria-label="Search">⌕</button>
      <button aria-label="Create task" onClick={onCreate}>+</button>
      <span className="todo-rail-spacer" />
      <button aria-label="Help">?</button>
    </aside>
    <aside className="todo-sidebar" aria-label="Board navigation">
      <div className="todo-workspace"><span className="todo-workspace-mark">R</span><span><strong>REDS workspace</strong><small>Mission operations</small></span></div>
      <nav className="todo-nav">{nav(workspaceLinks)}</nav>
      <p className="todo-nav-label">PROJECT</p>
      <nav className="todo-nav">{nav(projectLinks)}</nav>
      <div className="todo-sidebar-footer">Project settings</div>
    </aside>
    <main className="todo-main">
      <header className="todo-topbar"><span>REDS / <b>OPERATIONS</b></span><div><button className="todo-topbar-button">Release</button><button aria-label="More actions">•••</button></div></header>
      {children}
    </main>
  </div>;
}
