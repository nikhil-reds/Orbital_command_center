"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Codes do not match.");
      return;
    }
    // Logic for sign up
    console.log("Registering...", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#231F20', color: '#F6F6F3' }}>
      
      {/* Background styling matching the dashboard */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(11,218,81,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(11,218,81,.045) 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 10%, transparent 78%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 10%, transparent 78%)' }}></div>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 40% 44% at 50% 52%, rgba(8,160,60,.13), transparent 70%), radial-gradient(circle at 8% 88%, rgba(11,135,147,.10), transparent 55%), radial-gradient(circle at 96% 10%, rgba(31,191,138,.07), transparent 50%)' }}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Panel wrapper */}
        <div 
          className="hover:border-[rgba(51,245,117,.4)] hover:shadow-[inset_0_1px_0_rgba(148,250,182,.16),_inset_0_0_50px_rgba(6,121,45,.2),_0_18px_46px_rgba(0,0,0,.5)]" 
          style={{ position: 'relative', overflow: 'hidden', border: '1px solid rgba(11,218,81,.15)', borderRadius: '3px', background: 'rgba(41,41,41,.65)', backdropFilter: 'blur(18px)', boxShadow: 'inset 0 1px 0 rgba(148,250,182,.08), inset 0 0 40px rgba(4,83,31,.12), 0 18px 40px rgba(0,0,0,.4)', padding: '32px', transition: 'border-color .5s ease, box-shadow .5s ease' }}>
          
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '34px', background: 'linear-gradient(180deg, rgba(51,245,117,.16), transparent)', pointerEvents: 'none', animation: 'om-panel-scan 9s ease-in-out infinite' }}></div>
          
          <div className="flex flex-col items-center mb-8">
            <div style={{ position: 'relative', width: '40px', height: '40px', display: 'grid', placeItems: 'center', marginBottom: '16px' }}>
              <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(11,218,81,.5)', borderRadius: '50%', animation: 'om-spin 14s linear infinite', borderTopColor: 'transparent', borderLeftColor: 'rgba(11,218,81,.15)' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#33F575', boxShadow: '0 0 12px 2px rgba(11,218,81,.75)' }}></div>
            </div>
            <h1 style={{ fontSize: '22px', letterSpacing: '.15em', color: '#F6F6F3', whiteSpace: 'nowrap', fontWeight: 500 }}>REGISTRATION</h1>
            <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '10px', letterSpacing: '.22em', color: 'rgba(51,245,117,.5)', marginTop: '8px' }}>SOL SYSTEM // NEW OPERATIVE</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '10px', letterSpacing: '.2em', color: 'rgba(246,246,243,.6)' }}>OPERATIVE ID / EMAIL</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[rgba(41,41,41,.8)] border border-[rgba(11,218,81,.2)] rounded p-3 text-[#F6F6F3] focus:outline-none focus:border-[#33F575] focus:shadow-[0_0_15px_rgba(11,218,81,.3)] transition-all"
                style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '12px', letterSpacing: '.1em' }}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '10px', letterSpacing: '.2em', color: 'rgba(246,246,243,.6)' }}>ACCESS CODE</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[rgba(41,41,41,.8)] border border-[rgba(11,218,81,.2)] rounded p-3 text-[#F6F6F3] focus:outline-none focus:border-[#33F575] focus:shadow-[0_0_15px_rgba(11,218,81,.3)] transition-all"
                style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '12px', letterSpacing: '.1em' }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '10px', letterSpacing: '.2em', color: 'rgba(246,246,243,.6)' }}>VERIFY CODE</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[rgba(41,41,41,.8)] border border-[rgba(11,218,81,.2)] rounded p-3 text-[#F6F6F3] focus:outline-none focus:border-[#33F575] focus:shadow-[0_0_15px_rgba(11,218,81,.3)] transition-all"
                style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '12px', letterSpacing: '.1em' }}
              />
            </div>

            <button 
              type="submit"
              className="mt-4 w-full p-3 rounded text-[#231F20] hover:text-[#231F20] transition-all hover:shadow-[0_0_20px_rgba(11,218,81,.6)]"
              style={{ background: 'linear-gradient(90deg, #0BDA51, #33F575)', fontFamily: 'var(--font-body), sans-serif', fontSize: '12px', letterSpacing: '.2em', fontWeight: 600 }}
            >
              CREATE CLEARANCE
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[rgba(11,218,81,.1)] text-center">
            <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '10px', letterSpacing: '.1em', color: 'rgba(246,246,243,.4)' }}>
              EXISTING OPERATIVE?{' '}
              <Link href="/signin" className="text-[#33F575] hover:text-[#94FAB6] hover:shadow-[0_0_10px_rgba(51,245,117,.5)] transition-all ml-2" style={{ letterSpacing: '.2em' }}>
                CONNECT HERE
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
