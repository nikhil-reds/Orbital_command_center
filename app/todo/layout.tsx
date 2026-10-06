import React from "react";

export default function TodoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#231F20", color: "#F6F6F3" }}>
      {/* Background styling */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(11,218,81,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(11,218,81,.045) 1px, transparent 1px)", backgroundSize: "64px 64px", maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000 10%, transparent 78%)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, #000 10%, transparent 78%)", zIndex: 0 }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 40% 44% at 50% 52%, rgba(8,160,60,.13), transparent 70%), radial-gradient(circle at 8% 88%, rgba(11,135,147,.10), transparent 55%), radial-gradient(circle at 96% 10%, rgba(31,191,138,.07), transparent 50%)", zIndex: 0 }} />

      <main className="relative z-10 p-4 md:p-6">
        <div className="relative rounded border border-[rgba(11,218,81,.15)] bg-[rgba(41,41,41,.45)] backdrop-blur-lg p-5 md:p-7 shadow-[inset_0_1px_0_rgba(148,250,182,.08),_0_18px_40px_rgba(0,0,0,.4)]">
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 2, background: "linear-gradient(90deg, rgba(11,218,81,.7), #33F575)", boxShadow: "0 0 12px rgba(11,218,81,.8)" }} />
          {children}
        </div>
      </main>
    </div>
  );
}
