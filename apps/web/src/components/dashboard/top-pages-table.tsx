"use client";

const pages = [
  { path: "/", title: "Home", views: "48,219", uniques: "32,146", avgTime: "2m 34s", bounceRate: "24.3%", trend: "up" as const },
  { path: "/pricing", title: "Pricing", views: "31,872", uniques: "28,421", avgTime: "3m 12s", bounceRate: "18.7%", trend: "up" as const },
  { path: "/features", title: "Features", views: "24,534", uniques: "19,287", avgTime: "2m 48s", bounceRate: "31.2%", trend: "up" as const },
  { path: "/docs/api", title: "API Docs", views: "18,923", uniques: "12,654", avgTime: "5m 41s", bounceRate: "12.1%", trend: "up" as const },
  { path: "/blog", title: "Blog", views: "15,421", uniques: "11,832", avgTime: "4m 15s", bounceRate: "42.8%", trend: "down" as const },
  { path: "/signup", title: "Sign Up", views: "12,347", uniques: "10,921", avgTime: "1m 52s", bounceRate: "67.4%", trend: "down" as const },
  { path: "/contact", title: "Contact", views: "8,219", uniques: "7,142", avgTime: "1m 28s", bounceRate: "54.3%", trend: "up" as const },
  { path: "/about", title: "About", views: "6,893", uniques: "5,421", avgTime: "2m 02s", bounceRate: "38.9%", trend: "down" as const },
];

export function TopPagesTable() {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
        <div>
          <h3 className="text-sm font-semibold text-[#0B1C30]">Top Pages</h3>
          <p className="text-xs text-[#5A5E69] mt-0.5">Most visited pages in the last 24 hours</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#F1F5F9] text-[#434655] font-mono text-[11px]">
            <span className="material-symbols-outlined text-[14px]">search</span>
            <span>Filter pages...</span>
          </div>
          <button className="text-xs text-[#2563EB] font-medium hover:underline">View All Pages</button>
        </div>
      </div>

      <table className="data-table w-full">
        <thead>
          <tr>
            <th className="w-12 text-center">#</th>
            <th>Page</th>
            <th className="text-right">Views</th>
            <th className="text-right">Uniques</th>
            <th className="text-right">Avg. Time</th>
            <th className="text-right">Bounce Rate</th>
            <th className="w-12 text-center">Trend</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page, idx) => (
            <tr key={page.path} className="hover:bg-[#F8FAFC] transition-colors">
              <td className="text-center font-mono text-[#94A3B8] text-xs">{idx + 1}</td>
              <td>
                <div className="flex flex-col">
                  <span className="text-[#0B1C30] font-medium text-xs">{page.title}</span>
                  <span className="font-mono text-[11px] text-[#94A3B8]">{page.path}</span>
                </div>
              </td>
              <td className="numeric font-mono text-xs text-[#0B1C30]">{page.views}</td>
              <td className="numeric font-mono text-xs text-[#0B1C30]">{page.uniques}</td>
              <td className="numeric font-mono text-xs text-[#0B1C30]">{page.avgTime}</td>
              <td className="numeric font-mono text-xs text-[#0B1C30]">
                <span className={parseFloat(page.bounceRate) > 50 ? "text-[#EF4444]" : parseFloat(page.bounceRate) > 35 ? "text-[#F59E0B]" : "text-[#10B981]"}>
                  {page.bounceRate}
                </span>
              </td>
              <td className="text-center">
                <span className={`material-symbols-outlined text-[16px] ${page.trend === "up" ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                  {page.trend === "up" ? "trending_up" : "trending_down"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
