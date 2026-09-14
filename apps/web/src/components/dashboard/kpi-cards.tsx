"use client";

interface KpiCardData {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: string;
  sparkColor: string;
  sparkPath: string;
  sparkFill: string;
}

const kpiData: KpiCardData[] = [
  {
    label: "Total Visitors",
    value: "124,892",
    change: "+18.4%",
    changeType: "up",
    icon: "group",
    sparkColor: "#2563EB",
    sparkPath: "M0,24 L10,21 L22,23 L35,17 L48,19 L60,11 L74,14 L86,8 L100,4",
    sparkFill: "M0,24 L10,21 L22,23 L35,17 L48,19 L60,11 L74,14 L86,8 L100,4 L100,28 L0,28 Z",
  },
  {
    label: "Page Views",
    value: "482,193",
    change: "+24.7%",
    changeType: "up",
    icon: "visibility",
    sparkColor: "#8B5CF6",
    sparkPath: "M0,26 L12,22 L24,19 L38,21 L52,14 L65,16 L78,9 L90,6 L100,2",
    sparkFill: "M0,26 L12,22 L24,19 L38,21 L52,14 L65,16 L78,9 L90,6 L100,2 L100,28 L0,28 Z",
  },
  {
    label: "Sessions",
    value: "156,421",
    change: "+15.2%",
    changeType: "up",
    icon: "devices",
    sparkColor: "#06B6D4",
    sparkPath: "M0,22 L14,20 L28,16 L42,18 L56,12 L70,14 L84,8 L100,5",
    sparkFill: "M0,22 L14,20 L28,16 L42,18 L56,12 L70,14 L84,8 L100,5 L100,28 L0,28 Z",
  },
  {
    label: "Bounce Rate",
    value: "31.8%",
    change: "-4.2%",
    changeType: "down",
    icon: "undo",
    sparkColor: "#10B981",
    sparkPath: "M0,8 L15,10 L30,14 L45,12 L60,16 L75,19 L90,22 L100,24",
    sparkFill: "M0,8 L15,10 L30,14 L45,12 L60,16 L75,19 L90,22 L100,24 L100,28 L0,28 Z",
  },
  {
    label: "Avg. Duration",
    value: "3m 24s",
    change: "+12.1%",
    changeType: "up",
    icon: "timer",
    sparkColor: "#F59E0B",
    sparkPath: "M0,20 L12,18 L24,22 L36,16 L48,19 L60,13 L72,15 L84,10 L100,6",
    sparkFill: "M0,20 L12,18 L24,22 L36,16 L48,19 L60,13 L72,15 L84,10 L100,6 L100,28 L0,28 Z",
  },
  {
    label: "Conversion",
    value: "3.21%",
    change: "+0.8%",
    changeType: "up",
    icon: "ads_click",
    sparkColor: "#EC4899",
    sparkPath: "M0,23 L14,20 L28,22 L42,17 L56,15 L70,18 L84,11 L100,7",
    sparkFill: "M0,23 L14,20 L28,22 L42,17 L56,15 L70,18 L84,11 L100,7 L100,28 L0,28 Z",
  },
];

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {kpiData.map((kpi) => (
        <div
          key={kpi.label}
          className="metric-card flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-[#5A5E69]">
            <span className="text-xs text-[#434655] font-medium">{kpi.label}</span>
            <span className="material-symbols-outlined text-[16px]">{kpi.icon}</span>
          </div>
          <div className="my-2">
            <div className="font-mono text-lg font-bold text-[#0B1C30] tracking-tight">{kpi.value}</div>
            <div className="flex items-center gap-1 mt-0.5 font-mono text-[11px] font-medium" style={{ color: kpi.changeType === "up" ? "#10B981" : "#EF4444" }}>
              <span className="material-symbols-outlined text-[14px]">
                {kpi.changeType === "up" ? "trending_up" : "trending_down"}
              </span>
              <span>{kpi.change}</span>
              <span className="text-[#5A5E69] text-xs font-normal" style={{ fontFamily: 'var(--font-sans)' }}>vs prev</span>
            </div>
          </div>
          <div className="w-full h-8 pt-1">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 28">
              <defs>
                <linearGradient id={`grad-${kpi.label.replace(/\s/g, "")}`} x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor={kpi.sparkColor} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={kpi.sparkColor} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={kpi.sparkFill} fill={`url(#grad-${kpi.label.replace(/\s/g, "")})`} />
              <path d={kpi.sparkPath} fill="none" stroke={kpi.sparkColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
