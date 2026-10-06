"use client";

import React, { useState } from "react";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface Task {
  id: string;
  title: string;
  priority: Priority;
  assignee: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const INITIAL_DATA: Column[] = [
  {
    id: "backlog",
    title: "BACKLOG",
    tasks: [
      { id: "ORB-102", title: "Recalibrate deep space sensor array", priority: "MEDIUM", assignee: "JD" },
      { id: "ORB-105", title: "Update quantum encryption keys", priority: "HIGH", assignee: "AL" },
      { id: "ORB-108", title: "Analyze anomaly in sector 7G", priority: "LOW", assignee: "MK" },
    ]
  },
  {
    id: "in-progress",
    title: "IN PROGRESS",
    tasks: [
      { id: "ORB-099", title: "Deploy satellite network to Mars orbit", priority: "CRITICAL", assignee: "RS" },
      { id: "ORB-101", title: "Establish communication with Voyager 3", priority: "HIGH", assignee: "TJ" },
    ]
  },
  {
    id: "review",
    title: "REVIEW",
    tasks: [
      { id: "ORB-085", title: "Patch hull integrity monitors", priority: "MEDIUM", assignee: "AL" },
    ]
  },
  {
    id: "completed",
    title: "COMPLETED",
    tasks: [
      { id: "ORB-070", title: "Routine thruster diagnostics", priority: "LOW", assignee: "JD" },
      { id: "ORB-062", title: "Sync orbital clocks with Earth UTC", priority: "HIGH", assignee: "RS" },
    ]
  }
];

export default function TodoPage() {
  const [columns, setColumns] = useState<Column[]>(INITIAL_DATA);

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case "CRITICAL": return "#D32735";
      case "HIGH": return "#ff9933";
      case "MEDIUM": return "#f0e68c";
      case "LOW": return "#33F575";
      default: return "#ffffff";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '0.1em', color: '#F6F6F3', textShadow: '0 0 20px rgba(51,245,117,0.5)', marginBottom: '0.5rem' }}>
            TASK MANAGEMENT
          </h1>
          <p style={{ fontFamily: 'var(--font-body), sans-serif', color: 'rgba(246,246,243,.7)', fontSize: '12px', letterSpacing: '0.15em' }}>
            JIRA-SYNCED DIRECTIVES
          </p>
        </div>
        <button 
          className="px-4 py-2 text-xs font-bold tracking-widest text-[#231F20] rounded hover:shadow-[0_0_15px_rgba(11,218,81,0.8)] transition-all"
          style={{ background: 'linear-gradient(90deg, #0BDA51, #33F575)', fontFamily: 'var(--font-body), sans-serif' }}
        >
          + CREATE DIRECTIVE
        </button>
      </div>

      <div className="flex flex-1 gap-6 overflow-x-auto pb-4">
        {columns.map(col => (
          <div key={col.id} className="flex flex-col w-[320px] shrink-0">
            {/* Column Header */}
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '11px', letterSpacing: '0.2em', color: '#33F575', fontWeight: 600 }}>
                {col.title} <span className="text-[rgba(246,246,243,.4)] ml-2">({col.tasks.length})</span>
              </h2>
            </div>
            
            {/* Column Body */}
            <div className="flex-1 flex flex-col gap-4 p-2 rounded bg-[rgba(35,31,32,.4)] border border-[rgba(11,218,81,.1)] overflow-y-auto">
              {col.tasks.map(task => (
                <div 
                  key={task.id} 
                  className="group cursor-pointer flex flex-col p-4 rounded transition-all duration-300"
                  style={{ 
                    background: 'rgba(51,53,56,.6)', 
                    border: '1px solid rgba(11,218,81,.15)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(51,245,117,.4)';
                    e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(8,160,60,.1), 0 4px 12px rgba(0,0,0,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(11,218,81,.15)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
                  }}
                >
                  <p style={{ fontSize: '13px', color: '#F6F6F3', marginBottom: '12px', lineHeight: '1.4' }}>
                    {task.title}
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-3 border-t border-[rgba(11,218,81,.1)]">
                    <span style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '10px', color: 'rgba(246,246,243,.6)' }}>
                      {task.id}
                    </span>
                    <div className="flex items-center gap-3">
                      <span 
                        style={{ 
                          fontFamily: 'var(--font-body), sans-serif', 
                          fontSize: '8px', 
                          letterSpacing: '0.1em',
                          color: getPriorityColor(task.priority),
                          border: `1px solid ${getPriorityColor(task.priority)}44`,
                          padding: '2px 6px',
                          borderRadius: '2px',
                          background: `${getPriorityColor(task.priority)}11`
                        }}
                      >
                        {task.priority}
                      </span>
                      <div 
                        className="flex items-center justify-center rounded-full bg-[rgba(51,245,117,.2)] text-[#33F575]"
                        style={{ width: '22px', height: '22px', fontSize: '9px', fontFamily: 'var(--font-body), sans-serif', border: '1px solid rgba(51,245,117,.4)' }}
                      >
                        {task.assignee}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Task Button (Ghost) */}
              <button 
                className="w-full py-3 mt-2 rounded border border-dashed border-[rgba(11,218,81,.2)] text-[rgba(51,245,117,.5)] hover:text-[#33F575] hover:border-[#33F575] hover:bg-[rgba(11,218,81,.05)] transition-all"
                style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '10px', letterSpacing: '0.1em' }}
              >
                + ADD DIRECTIVE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
