import type { ReactNode } from "react";
import { TodoWorkspaceFrame } from "./workspace-frame";

type Card = { title: string; detail: string; tone: "purple" | "blue" | "amber" | "green" };

export function TodoStaticPage({ eyebrow = "WORKSPACE", title, description, cards, children }: { eyebrow?: string; title: string; description: string; cards: Card[]; children?: ReactNode }) {
  return <TodoWorkspaceFrame><div className="todo-page todo-static">
    <header className="todo-static-header"><div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></div><button className="admin-button">+ CREATE</button></header>
    <div className="todo-static-metrics"><div><span>ACTIVE</span><b>{cards.length}</b></div><div><span>UPDATED</span><b>Today</b></div><div><span>WORKSPACE</span><b>REDS</b></div></div>
    <section className="todo-static-grid">{cards.map((card) => <article key={card.title} className={`todo-static-card ${card.tone}`}><span className="todo-card-dot" /><h2>{card.title}</h2><p>{card.detail}</p><button>Open →</button></article>)}</section>{children}
  </div></TodoWorkspaceFrame>;
}

export function StaticList({ title, items }: { title: string; items: string[] }): ReactNode {
  return <section className="todo-static-list"><h2>{title}</h2>{items.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b><small>Updated today</small><button>View</button></div>)}</section>;
}
