"use client";

const browsers = [
  { name: "Chrome", share: 58.4, color: "#2563EB" },
  { name: "Safari", share: 21.2, color: "#06B6D4" },
  { name: "Firefox", share: 9.8, color: "#F59E0B" },
  { name: "Edge", share: 7.1, color: "#10B981" },
  { name: "Other", share: 3.5, color: "#94A3B8" },
];

const devices = [
  { type: "Desktop", percentage: 62, icon: "computer" },
  { type: "Mobile", percentage: 31, icon: "smartphone" },
  { type: "Tablet", percentage: 7, icon: "tablet_mac" },
];

const os = [
  { name: "macOS", share: "38.2%" },
  { name: "Windows", share: "31.7%" },
  { name: "iOS", share: "16.4%" },
  { name: "Android", share: "10.1%" },
  { name: "Linux", share: "3.6%" },
];

export function EnvironmentHardware() {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#0B1C30]">Environment & Hardware</h3>
          <p className="text-xs text-[#5A5E69] mt-0.5">Browser, device, and OS distribution</p>
        </div>
      </div>

      {/* Devices */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {devices.map((d) => (
          <div key={d.type} className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0] text-center">
            <span className="material-symbols-outlined text-[24px] text-[#434655]">{d.icon}</span>
            <div className="font-mono text-lg font-bold text-[#0B1C30] mt-1">{d.percentage}%</div>
            <div className="text-[11px] text-[#5A5E69]">{d.type}</div>
          </div>
        ))}
      </div>

      {/* Browsers */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-[#434655] mb-2">Browsers</div>
        <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-[#F1F5F9]">
          {browsers.map((b) => (
            <div
              key={b.name}
              className="h-full transition-all duration-500"
              style={{ width: `${b.share}%`, backgroundColor: b.color }}
              title={`${b.name}: ${b.share}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          {browsers.map((b) => (
            <div key={b.name} className="flex items-center gap-1 text-[11px]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
              <span className="text-[#434655]">{b.name}</span>
              <span className="font-mono text-[#94A3B8]">{b.share}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* OS */}
      <div>
        <div className="text-xs font-semibold text-[#434655] mb-2">Operating Systems</div>
        <div className="space-y-1.5">
          {os.map((o) => (
            <div key={o.name} className="flex items-center justify-between text-xs">
              <span className="text-[#434655]">{o.name}</span>
              <span className="font-mono text-[#0B1C30] font-medium">{o.share}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
