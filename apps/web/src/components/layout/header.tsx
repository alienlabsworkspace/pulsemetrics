"use client";

export function Header() {
  return (
    <header className="fixed top-0 left-[260px] right-0 h-14 bg-[#F8FAFC]/90 backdrop-blur-md z-40 px-6 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-[#2563EB] flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[16px]">insights</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-[#434655]">
          <span className="text-[#0B1C30]">cluster-east</span>
          <span className="text-[#C3C6D7]">/</span>
          <span>ingestion-pool</span>
          <span className="text-[#C3C6D7]">/</span>
          <span className="text-[#2563EB] font-semibold">telemetry</span>
        </div>
      </div>

      {/* Right: Status Badges & Actions */}
      <div className="flex items-center gap-3">
        {/* Ingestion Rate */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#10B981]/10 text-[#10B981] font-mono text-[11px] font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-[#10B981]" />
          <span>18,421 ev/s</span>
        </div>

        {/* Region */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F1F5F9] text-[#434655] font-mono text-[11px]">
          <span className="material-symbols-outlined text-[14px]">public</span>
          <span>us-east-1 (p99: 14ms)</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg text-[#434655] hover:bg-[#F1F5F9] hover:text-[#0B1C30] transition-colors">
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>
          <button className="relative p-1.5 rounded-lg text-[#434655] hover:bg-[#F1F5F9] hover:text-[#0B1C30] transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
          </button>
        </div>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[18px]">person</span>
        </div>
      </div>
    </header>
  );
}
