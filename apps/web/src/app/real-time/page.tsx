"use client";

import { useState, useEffect, useRef } from "react";

interface LiveEvent {
  id: string;
  timestamp: string;
  event: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  status: number;
  duration: string;
  region: string;
  userId: string;
}

const sampleEvents: LiveEvent[] = [
  { id: "tr_a1b2c3", timestamp: "14:32:18.421", event: "page_view", method: "GET", path: "/pricing", status: 200, duration: "12ms", region: "us-east-1", userId: "usr_8k2m4n" },
  { id: "tr_d4e5f6", timestamp: "14:32:18.189", event: "button_click", method: "POST", path: "/api/v1/events", status: 202, duration: "8ms", region: "eu-west-1", userId: "usr_2j7p9q" },
  { id: "tr_g7h8i9", timestamp: "14:32:17.842", event: "page_view", method: "GET", path: "/features", status: 200, duration: "15ms", region: "us-west-2", userId: "usr_5m3n1k" },
  { id: "tr_j1k2l3", timestamp: "14:32:17.521", event: "form_submit", method: "POST", path: "/api/v1/signup", status: 201, duration: "142ms", region: "ap-south-1", userId: "usr_9w4x6y" },
  { id: "tr_m4n5o6", timestamp: "14:32:17.103", event: "api_call", method: "GET", path: "/api/v1/analytics", status: 200, duration: "34ms", region: "us-east-1", userId: "usr_1a2b3c" },
  { id: "tr_p7q8r9", timestamp: "14:32:16.891", event: "page_view", method: "GET", path: "/docs/sdk", status: 200, duration: "11ms", region: "eu-central-1", userId: "usr_4d5e6f" },
  { id: "tr_s1t2u3", timestamp: "14:32:16.342", event: "error", method: "POST", path: "/api/v1/webhook", status: 500, duration: "2104ms", region: "us-east-1", userId: "usr_7g8h9i" },
  { id: "tr_v4w5x6", timestamp: "14:32:15.921", event: "scroll_depth", method: "POST", path: "/api/v1/events", status: 202, duration: "6ms", region: "us-west-2", userId: "usr_0j1k2l" },
  { id: "tr_y7z8a1", timestamp: "14:32:15.442", event: "page_view", method: "GET", path: "/blog/scaling-analytics", status: 200, duration: "18ms", region: "ap-northeast-1", userId: "usr_3m4n5o" },
  { id: "tr_b2c3d4", timestamp: "14:32:14.832", event: "identify", method: "POST", path: "/api/v1/identify", status: 200, duration: "23ms", region: "eu-west-1", userId: "usr_6p7q8r" },
  { id: "tr_e5f6g7", timestamp: "14:32:14.211", event: "page_view", method: "GET", path: "/contact", status: 200, duration: "9ms", region: "us-east-1", userId: "usr_9s0t1u" },
  { id: "tr_h8i9j1", timestamp: "14:32:13.891", event: "button_click", method: "POST", path: "/api/v1/events", status: 202, duration: "7ms", region: "sa-east-1", userId: "usr_2v3w4x" },
];

function statusColor(status: number) {
  if (status >= 500) return "text-[#EF4444]";
  if (status >= 400) return "text-[#F59E0B]";
  return "text-[#10B981]";
}

function methodBadge(method: string) {
  const map: Record<string, string> = {
    GET: "badge-get",
    POST: "badge-post",
    PUT: "badge-get",
    DELETE: "badge-delete",
  };
  return map[method] ?? "badge-get";
}

export default function RealTimePage() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [events, setEvents] = useState(sampleEvents);
  const [liveUsers, setLiveUsers] = useState(2847);
  const [ingestionRate, setIngestionRate] = useState(18421);
  const [p99, setP99] = useState(14);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setLiveUsers((v) => v + Math.floor(Math.random() * 20 - 8));
      setIngestionRate((v) => v + Math.floor(Math.random() * 200 - 80));
      setP99((v) => Math.max(8, Math.min(28, v + Math.floor(Math.random() * 4 - 2))));
    }, 2000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-[#0B1C30] tracking-tight">Real-Time</h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] font-mono text-[11px] font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
              </span>
              SYNCED (500ms)
            </span>
          </div>
          <p className="text-[13px] text-[#434655]">Monitor events and active users as they happen across your global edge nodes.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#F1F5F9] rounded-xl p-0.5">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#2563EB] shadow-sm font-mono text-xs transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">{isStreaming ? "pause" : "play_arrow"}</span>
              <span>{isStreaming ? "Streaming" : "Paused"}</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[#434655] hover:text-[#0B1C30] font-mono text-xs transition-colors">
              <span className="material-symbols-outlined text-[16px]">layers_clear</span>
              <span>Clear</span>
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563EB] text-white font-mono text-xs shadow-sm hover:bg-[#1D4ED8] transition-all">
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export Raw</span>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="metric-card relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-20 h-20 bg-[#10B981]/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#434655] font-semibold">Live Users</span>
            <div className="flex items-center gap-1 font-mono text-[11px] text-[#10B981]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              active
            </div>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="font-mono text-[28px] leading-tight font-bold text-[#0B1C30] tracking-tight">{liveUsers.toLocaleString()}</span>
            <span className="font-mono text-[11px] text-[#10B981] font-medium">+14.2%</span>
          </div>
          <div className="flex items-center justify-between text-[#434655] text-xs">
            <span>Active in last 5m</span>
            <span className="font-mono text-[#0B1C30]">32 clusters</span>
          </div>
        </div>

        <div className="metric-card relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-20 h-20 bg-[#2563EB]/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#434655] font-semibold">Ingestion Rate</span>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="font-mono text-[28px] leading-tight font-bold text-[#0B1C30] tracking-tight">{ingestionRate.toLocaleString()}</span>
            <span className="font-mono text-xs text-[#434655]">ev/s</span>
          </div>
          <div className="flex items-center justify-between text-[#434655] text-xs">
            <span>Avg batch size</span>
            <span className="font-mono text-[#0B1C30]">128 events</span>
          </div>
        </div>

        <div className="metric-card relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#434655] font-semibold">P99 Latency</span>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="font-mono text-[28px] leading-tight font-bold text-[#0B1C30] tracking-tight">{p99}ms</span>
            <span className={`font-mono text-[11px] font-medium ${p99 <= 15 ? "text-[#10B981]" : "text-[#F59E0B]"}`}>
              {p99 <= 15 ? "healthy" : "elevated"}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#434655] text-xs">
            <span>p50: 4ms · p95: 11ms</span>
            <span className="font-mono text-[#0B1C30]">SLA: &lt;50ms</span>
          </div>
        </div>

        <div className="metric-card relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#434655] font-semibold">Error Rate</span>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="font-mono text-[28px] leading-tight font-bold text-[#10B981] tracking-tight">0.02%</span>
            <span className="font-mono text-[11px] text-[#10B981] font-medium">nominal</span>
          </div>
          <div className="flex items-center justify-between text-[#434655] text-xs">
            <span>3 errors / 18.4k events</span>
            <span className="font-mono text-[#0B1C30]">5xx: 1</span>
          </div>
        </div>
      </div>

      {/* Event Stream Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#2563EB]">bolt</span>
            <h3 className="text-sm font-semibold text-[#0B1C30]">Live Event Stream</h3>
            <span className="font-mono text-[11px] text-[#94A3B8]">{events.length} events</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#F1F5F9] text-[#434655] font-mono text-[11px]">
            <span className="material-symbols-outlined text-[14px]">filter_list</span>
            <span>Filter events...</span>
          </div>
        </div>

        <table className="data-table w-full">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Trace ID</th>
              <th>Event</th>
              <th>Method</th>
              <th>Path</th>
              <th className="text-right">Status</th>
              <th className="text-right">Duration</th>
              <th>Region</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                <td className="font-mono text-[11px] text-[#94A3B8]">{ev.timestamp}</td>
                <td className="font-mono text-[11px] text-[#2563EB]">{ev.id}</td>
                <td><span className="badge badge-get">{ev.event}</span></td>
                <td><span className={`badge ${methodBadge(ev.method)}`}>{ev.method}</span></td>
                <td className="font-mono text-xs text-[#434655]">{ev.path}</td>
                <td className={`numeric font-mono text-xs font-semibold ${statusColor(ev.status)}`}>{ev.status}</td>
                <td className={`numeric font-mono text-xs ${parseInt(ev.duration) > 100 ? "text-[#F59E0B] font-semibold" : "text-[#0B1C30]"}`}>{ev.duration}</td>
                <td className="font-mono text-[11px] text-[#434655]">{ev.region}</td>
                <td className="font-mono text-[11px] text-[#94A3B8]">{ev.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
