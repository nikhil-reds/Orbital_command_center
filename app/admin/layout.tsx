"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_PAGES = [
  { name: "OVERVIEW", path: "/admin" },
  { name: "OPERATIVES", path: "/admin/users" },
  { name: "TASK MANAGEMENT", path: "/admin/todo" },
  { name: "FLEET STATUS", path: "/admin/fleet" },
  { name: "NAVIGATION", path: "/admin/navigation" },
  { name: "COMMUNICATIONS", path: "/admin/communications" },
  { name: "SECURITY", path: "/admin/security" },
  { name: "REPORTS", path: "/admin/reports" },
  { name: "SYSTEM LOGS", path: "/admin/logs" },
  { name: "DIAGNOSTICS", path: "/admin/diagnostics" },
  { name: "SETTINGS", path: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#231F20', color: '#F6F6F3' }}>
      
      {/* Background styling */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(11,218,81,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(11,218,81,.045) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 10%, transparent 78%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 10%, transparent 78%)', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 40% 44% at 50% 52%, rgba(8,160,60,.13), transparent 70%), radial-gradient(circle at 8% 88%, rgba(11,135,147,.10), transparent 55%), radial-gradient(circle at 96% 10%, rgba(31,191,138,.07), transparent 50%)', zIndex: 0 }}></div>

      {/* Sidebar */}
      <aside style={{ width: '280px', position: 'relative', zIndex: 10, borderRight: '1px solid rgba(11,218,81,.15)', background: 'rgba(41,41,41,.75)', backdropFilter: 'blur(18px)' }} className="flex flex-col h-screen overflow-y-auto">
        
        {/* Logo/Brand */}
        <div className="p-6 border-b border-[rgba(11,218,81,.15)] flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div style={{ position: 'relative', width: '26px', height: '26px', display: 'grid', placeItems: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(11,218,81,.5)', borderRadius: '50%', animation: 'om-spin 14s linear infinite', borderTopColor: 'transparent', borderLeftColor: 'rgba(11,218,81,.15)' }}></div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#33F575', boxShadow: '0 0 12px 2px rgba(11,218,81,.75)' }}></div>
            </div>
            <div style={{ fontFamily: 'var(--font-sora), sans-serif', fontSize: '13px', letterSpacing: '.18em', fontWeight: 600, color: '#F6F6F3' }}>REDS COMMAND CENTER</div>
          </div>
          <div style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '9px', letterSpacing: '.22em', color: 'rgba(51,245,117,.5)' }}>ADMINISTRATION</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <div style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '10px', letterSpacing: '.26em', color: 'rgba(51,245,117,.85)', marginBottom: '12px', paddingLeft: '12px' }}>MODULES</div>
          
          {ADMIN_PAGES.map((page) => {
            const isActive = pathname === page.path;
            return (
              <Link key={page.path} href={page.path}>
                <div 
                  className={`flex items-center p-3 rounded transition-all duration-300 ${isActive ? 'bg-[rgba(11,218,81,.16)] border-[rgba(51,245,117,.42)] shadow-[inset_0_0_22px_rgba(8,160,60,.16),_0_0_18px_rgba(8,160,60,.1)]' : 'hover:bg-[rgba(11,218,81,.05)] hover:border-[rgba(11,218,81,.22)] border-transparent'}`}
                  style={{ border: '1px solid', borderColor: isActive ? 'rgba(51,245,117,.42)' : 'transparent' }}
                >
                  <span style={{ 
                    width: '6px', height: '6px', borderRadius: '50%', marginRight: '12px',
                    background: isActive ? '#0BDA51' : 'rgba(11,218,81,.3)', 
                    boxShadow: isActive ? '0 0 10px 2px rgba(11,218,81,.7)' : 'none',
                    animation: isActive ? 'om-blink 2.4s ease-in-out infinite' : 'none'
                  }}></span>
                  <span style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '11px', letterSpacing: '.2em', color: isActive ? '#F6F6F3' : 'rgba(246,246,243,.62)' }}>
                    {page.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-6 border-t border-[rgba(11,218,81,.15)]">
          <Link href="/">
            <div className="text-center p-3 rounded bg-[rgba(168,31,42,.2)] hover:bg-[rgba(211,39,53,.4)] border border-[rgba(211,39,53,.3)] text-[#F3CED1] transition-all cursor-pointer" style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '10px', letterSpacing: '.2em' }}>
              TERMINATE SESSION
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-auto p-10">
          {/* Glass pane container for content */}
          <div className="min-h-full border border-[rgba(11,218,81,.15)] rounded bg-[rgba(41,41,41,.45)] backdrop-blur-lg p-12 shadow-[inset_0_1px_0_rgba(148,250,182,.08),_0_18px_40px_rgba(0,0,0,.4)] relative">
             <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '2px', background: 'linear-gradient(90deg, rgba(11,218,81,.7), #33F575)', boxShadow: '0 0 12px rgba(11,218,81,.8)' }}></div>
             {children}
          </div>
        </div>
      </main>
    </div>
  );
}
