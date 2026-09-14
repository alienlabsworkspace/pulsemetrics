"use client";

const channels = [
  { name: "Direct", visitors: "42,819", percentage: 34.3, color: "#2563EB" },
  { name: "Organic Search", visitors: "31,223", percentage: 25.0, color: "#10B981" },
  { name: "Social Media", visitors: "18,734", percentage: 15.0, color: "#8B5CF6" },
  { name: "Referral", visitors: "13,742", percentage: 11.0, color: "#F59E0B" },
  { name: "Email", visitors: "10,619", percentage: 8.5, color: "#EC4899" },
  { name: "Paid Ads", visitors: "7,755", percentage: 6.2, color: "#06B6D4" },
];

export function AcquisitionChannels() {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#0B1C30]">Acquisition Channels</h3>
          <p className="text-xs text-[#5A5E69] mt-0.5">Traffic source breakdown</p>
        </div>
        <button className="text-xs text-[#2563EB] font-medium hover:underline">View All</button>
      </div>

      <div className="space-y-3">
        {channels.map((ch) => (
          <div key={ch.name} className="flex items-center gap-3">
            <div className="w-24 text-xs text-[#434655] font-medium truncate">{ch.name}</div>
            <div className="flex-1 bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${ch.percentage}%`, backgroundColor: ch.color }}
              />
            </div>
            <div className="flex items-center gap-2 w-28 justify-end">
              <span className="font-mono text-xs font-semibold text-[#0B1C30]">{ch.visitors}</span>
              <span className="font-mono text-[11px] text-[#94A3B8] w-10 text-right">{ch.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
