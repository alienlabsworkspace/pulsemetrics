"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

interface NavItem {
  label: string;
  icon: string;
  path: string;
  badge?: string | number;
  pulse?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: "dashboard", path: "/" },
      { label: "Real-Time", icon: "sensors", path: "/real-time", pulse: true },
      { label: "Events", icon: "account_tree", path: "/events" },
      { label: "Sessions", icon: "group", path: "/sessions" },
      { label: "Users", icon: "how_to_reg", path: "/users" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Acquisition", icon: "explore", path: "/acquisition" },
      { label: "Engagement", icon: "monitoring", path: "/engagement" },
      { label: "Retention", icon: "cached", path: "/retention" },
      { label: "Funnels", icon: "filter_alt", path: "/funnels" },
      { label: "Conversion", icon: "ads_click", path: "/conversion" },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { label: "Live Events", icon: "bolt", path: "/live-events" },
      { label: "System Health", icon: "memory", path: "/system-health" },
      { label: "Event Pipeline", icon: "alt_route", path: "/event-pipeline" },
      { label: "Alerts", icon: "notifications_active", path: "/alerts", badge: 1 },
    ],
  },
  {
    title: "Developer",
    items: [
      { label: "Projects", icon: "source", path: "/projects" },
      { label: "SDK", icon: "terminal", path: "/sdk" },
      { label: "API Keys", icon: "key", path: "/api-keys" },
      { label: "Webhooks", icon: "webhook", path: "/webhooks" },
      { label: "Documentation", icon: "menu_book", path: "/documentation" },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Team", icon: "badge", path: "/team" },
      { label: "Settings", icon: "tune", path: "/settings" },
      { label: "Billing", icon: "credit_card", path: "/billing" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#213145] text-[#EAF1FF] z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo & Brand */}
        <div className="p-3 pb-2">
          <div className="flex items-center justify-between gap-1 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-md bg-[#2563EB] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[16px]">insights</span>
              </div>
              <span className="font-sans text-sm font-bold tracking-tight text-white">PulseMetrics</span>
            </div>
            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white/10 text-[#4edea3]">v2.4.1</span>
          </div>

          {/* Cluster selector */}
          <button className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#EAF1FF] font-mono text-xs transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
              <span className="font-medium text-white">acme-prod</span>
            </div>
            <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">unfold_more</span>
          </button>

          {/* Quick jump */}
          <div className="mt-2">
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white/5 text-[#94A3B8] text-[11px]">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">search</span>
                <span>Quick jump...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[#EAF1FF] font-mono text-[10px]">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-3">
          {navigation.map((group) => (
            <div key={group.title} className="space-y-0.5">
              <div className="px-2 py-1 font-mono text-[11px] font-semibold tracking-wider text-[#94A3B8]/70 uppercase">
                {group.title}
              </div>
              {group.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={clsx(
                      "flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors text-[13px]",
                      isActive
                        ? "bg-[#2563EB] text-white font-semibold"
                        : "text-[#94A3B8] hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.pulse && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]" />
                      </span>
                    )}
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full bg-[#EF4444] text-white font-mono text-[11px] leading-none font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / User Profile */}
      <div className="p-2 bg-[#213145]/80">
        <div className="px-2 py-1.5 mb-1.5 rounded bg-white/5 flex items-center justify-between text-[11px] text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-[#4edea3]">corporate_fare</span>
            <span className="text-[#EAF1FF] font-medium">Acme Corp</span>
            <span className="text-[10px] uppercase font-mono px-1 py-0.5 rounded bg-white/10 text-[#3B82F6]">Pro</span>
          </div>
          <span className="material-symbols-outlined text-[14px]">expand_more</span>
        </div>
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#dce9ff] flex items-center justify-center font-sans text-sm text-[#2563EB] font-bold">
                AC
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4edea3] border-2 border-[#213145] rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] leading-tight text-white font-semibold">Alex Chen</span>
              <span className="font-mono text-[10px] leading-tight text-[#94A3B8]">Staff Infra Eng</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#94A3B8]">more_vert</span>
        </div>
      </div>
    </aside>
  );
}
