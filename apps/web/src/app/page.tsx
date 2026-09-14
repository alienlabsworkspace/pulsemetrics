import { KpiCards } from "@/components/dashboard/kpi-cards";
import { VisitorsChart } from "@/components/dashboard/visitors-chart";
import { RealtimePanel } from "@/components/dashboard/realtime-panel";
import { AcquisitionChannels } from "@/components/dashboard/acquisition-channels";
import { EnvironmentHardware } from "@/components/dashboard/environment-hardware";
import { TopPagesTable } from "@/components/dashboard/top-pages-table";

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full gap-4">
      {/* Header / Action Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-[#0B1C30] tracking-tight" style={{ fontFamily: 'var(--font-sans)' }}>
              Analytics Overview
            </h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#F1F5F9]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
              </span>
              <span className="font-mono text-[11px] font-semibold uppercase text-[#10B981]">Live</span>
            </div>
          </div>
          <p className="text-[13px] text-[#5A5E69]">
            Monitor your application traffic, users, events, and performance in real time.
            <span className="font-mono text-[11px] text-[#737686] ml-1">· Updated 3s ago</span>
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white shadow-sm text-[#0B1C30] border border-[#E2E8F0]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="font-mono text-xs font-medium">Production</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white shadow-sm border border-[#E2E8F0] text-[#0B1C30] hover:bg-[#F8FAFC] transition-colors text-xs">
            <span className="material-symbols-outlined text-[16px] text-[#5A5E69]">calendar_today</span>
            <span className="font-medium">Last 24 Hours</span>
            <span className="material-symbols-outlined text-[16px] text-[#5A5E69]">expand_more</span>
          </button>
          <button className="p-1.5 rounded-lg bg-white shadow-sm border border-[#E2E8F0] text-[#5A5E69] hover:text-[#0B1C30] hover:bg-[#F8FAFC] transition-colors">
            <span className="material-symbols-outlined text-[18px]">sync</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-medium shadow-sm hover:bg-[#1D4ED8] transition-colors">
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export CSV / JSON</span>
            <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <KpiCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <VisitorsChart />
        </div>
        <RealtimePanel />
      </div>

      {/* Acquisition & Environment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AcquisitionChannels />
        <EnvironmentHardware />
      </div>

      {/* Top Pages Table */}
      <TopPagesTable />
    </div>
  );
}
