"use client";

import { useState, useEffect } from "react";

interface EventRow {
  id: string;
  event: string;
  page: string;
  timestamp: string;
}

const initialEvents: EventRow[] = [
  { id: "ev_01", event: "page_view", page: "/pricing", timestamp: "0.3s ago" },
  { id: "ev_02", event: "button_click", page: "/features", timestamp: "1.2s ago" },
  { id: "ev_03", event: "page_view", page: "/docs/api", timestamp: "2.8s ago" },
  { id: "ev_04", event: "form_submit", page: "/signup", timestamp: "3.4s ago" },
  { id: "ev_05", event: "page_view", page: "/blog/analytics", timestamp: "4.1s ago" },
  { id: "ev_06", event: "scroll_depth", page: "/pricing", timestamp: "5.7s ago" },
];

export function RealtimePanel() {
  const [activeUsers, setActiveUsers] = useState(847);
  const [events, setEvents] = useState(initialEvents);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 10 - 4));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#0B1C30]">Real-Time</h3>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ECFDF5] text-[#047857] font-mono text-[11px] font-medium border border-[#A7F3D0]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          Connected
        </div>
      </div>

      {/* Active Users */}
      <div className="bg-[#F8FAFC] rounded-lg p-3 mb-3 border border-[#E2E8F0]">
        <div className="text-xs text-[#434655] mb-1">Active Users Right Now</div>
        <div className="font-mono text-3xl font-bold text-[#0B1C30] tracking-tight">
          {activeUsers.toLocaleString()}
        </div>
        <div className="flex items-center gap-3 mt-2 text-[11px] font-mono">
          <div className="flex items-center gap-1 text-[#2563EB]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            Desktop 62%
          </div>
          <div className="flex items-center gap-1 text-[#8B5CF6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
            Mobile 31%
          </div>
          <div className="flex items-center gap-1 text-[#06B6D4]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
            Tablet 7%
          </div>
        </div>
      </div>

      {/* Pipeline Status */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-[#F8FAFC] rounded-lg p-2.5 border border-[#E2E8F0]">
          <div className="text-[11px] text-[#434655] mb-0.5">Ingestion</div>
          <div className="font-mono text-sm font-semibold text-[#10B981]">18.4k/s</div>
        </div>
        <div className="bg-[#F8FAFC] rounded-lg p-2.5 border border-[#E2E8F0]">
          <div className="text-[11px] text-[#434655] mb-0.5">p99 Latency</div>
          <div className="font-mono text-sm font-semibold text-[#0B1C30]">14ms</div>
        </div>
      </div>

      {/* Live Event Stream */}
      <div className="flex-1">
        <div className="text-xs font-semibold text-[#434655] mb-2 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">bolt</span>
          Live Event Stream
        </div>
        <div className="space-y-1">
          {events.map((ev) => (
            <div key={ev.id} className="flex items-center justify-between py-1 px-2 rounded hover:bg-[#F8FAFC] text-[11px] transition-colors">
              <div className="flex items-center gap-2">
                <span className="badge badge-get">{ev.event}</span>
                <span className="text-[#434655] font-mono">{ev.page}</span>
              </div>
              <span className="text-[#94A3B8] font-mono">{ev.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
