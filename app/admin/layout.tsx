"use client";

import "./responsive.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const ADMIN_PAGES = [["Overview", "/admin"], ["Task board", "/todo"], ["Users", "/admin/users"]] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const signOut = async () => { await fetch("/api/auth/signout", { method: "POST" }); router.replace("/signin"); router.refresh(); };

  return <div className="admin-shell"><aside className="admin-rail" aria-label="Primary navigation"><Link href="/admin" className="admin-rail-logo">R</Link><Link href="/admin" className={pathname === "/admin" ? "active" : ""} aria-label="Overview">▦</Link><Link href="/todo" className={pathname === "/todo" ? "active" : ""} aria-label="Task board">✓</Link><Link href="/admin/users" className={pathname === "/admin/users" ? "active" : ""} aria-label="Users">◉</Link><span /><button type="button" onClick={signOut} aria-label="Log out">↪</button></aside><aside className="admin-sidebar"><Link href="/admin" className="admin-brand"><span className="admin-mark">R</span><span><strong>REDS workspace</strong><small>Mission operations</small></span></Link><nav><p className="admin-nav-label">WORKSPACE</p>{ADMIN_PAGES.map(([name, path]) => <Link key={path} href={path} className={`admin-nav-item ${pathname === path ? "active" : ""}`}><span />{name}</Link>)}<button type="button" className="admin-nav-item admin-logout" onClick={signOut}><span />Log out</button></nav></aside><main className="admin-main"><header className="admin-topbar"><span>ADMINISTRATION / <b>LIVE CONTROL</b></span><div><span className="admin-live-dot" /> All systems online <button aria-label="Notifications">◌</button></div></header><div className="admin-content">{children}</div></main></div>;
}
