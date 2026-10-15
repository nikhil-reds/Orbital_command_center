import type { ReactNode } from "react";
export function Header({ eyebrow = "ADMINISTRATION", title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) { return <div className="admin-page-header"><div><p>{eyebrow}</p><h1>{title}</h1><span>{description}</span></div>{action}</div>; }
export function Card({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) { return <section className={`admin-card ${className}`}>{title && <h2>{title}</h2>}{children}</section>; }
export function Metric({ label, value, change }: { label: string; value: string; change?: string }) { return <Card className="admin-metric"><p>{label}</p><strong>{value}</strong>{change && <span className={change.startsWith("+") ? "up" : "muted"}>{change}</span>}</Card>; }
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" | "bad" }) { return <span className={`admin-badge ${tone}`}>{children}</span>; }
export function Bar({ value }: { value: number }) { return <span className="admin-bar"><i style={{ width: `${value}%` }} /></span>; }
