"use client";

import { useEffect, useRef } from "react";

const hours = ["00:00","02:00","04:00","06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00"];
const visitors =  [2100,1800,1400,1600,3200,5400,7800,9200,8400,7600,6800,5200];
const pageViews = [4200,3600,2800,3200,6400,10800,15600,18400,16800,15200,13600,10400];

export function VisitorsChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padL = 50, padR = 20, padT = 20, padB = 30;
    const chartW = w - padL - padR;
    const chartH = h - padT - padB;

    const maxVal = Math.max(...pageViews) * 1.1;

    // Grid lines
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = padT + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();

      // Y labels
      ctx.fillStyle = "#64748B";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText(((maxVal * (5 - i)) / 5 / 1000).toFixed(0) + "k", padL - 8, y + 4);
    }

    // X labels
    ctx.fillStyle = "#64748B";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    hours.forEach((label, i) => {
      const x = padL + (chartW / (hours.length - 1)) * i;
      ctx.fillText(label, x, h - 6);
    });

    // Draw area + line for page views
    const drawSeries = (data: number[], color: string, alpha: number) => {
      const points = data.map((v, i) => ({
        x: padL + (chartW / (data.length - 1)) * i,
        y: padT + chartH - (v / maxVal) * chartH,
      }));

      // Area
      ctx.beginPath();
      ctx.moveTo(points[0]!.x, points[0]!.y);
      for (let i = 1; i < points.length; i++) {
        const cp1x = points[i - 1]!.x + (points[i]!.x - points[i - 1]!.x) / 3;
        const cp2x = points[i]!.x - (points[i]!.x - points[i - 1]!.x) / 3;
        ctx.bezierCurveTo(cp1x, points[i - 1]!.y, cp2x, points[i]!.y, points[i]!.x, points[i]!.y);
      }
      ctx.lineTo(points[points.length - 1]!.x, padT + chartH);
      ctx.lineTo(points[0]!.x, padT + chartH);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
      grad.addColorStop(0, color.replace(")", `,${alpha})`).replace("rgb", "rgba"));
      grad.addColorStop(1, color.replace(")", ",0)").replace("rgb", "rgba"));
      ctx.fillStyle = grad;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.moveTo(points[0]!.x, points[0]!.y);
      for (let i = 1; i < points.length; i++) {
        const cp1x = points[i - 1]!.x + (points[i]!.x - points[i - 1]!.x) / 3;
        const cp2x = points[i]!.x - (points[i]!.x - points[i - 1]!.x) / 3;
        ctx.bezierCurveTo(cp1x, points[i - 1]!.y, cp2x, points[i]!.y, points[i]!.x, points[i]!.y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    drawSeries(pageViews, "rgb(37, 99, 235)", 0.15);
    drawSeries(visitors, "rgb(16, 185, 129)", 0.12);
  }, []);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#0B1C30]">Visitors & Page Views</h3>
          <p className="text-xs text-[#5A5E69] mt-0.5">Hourly breakdown for the last 24h</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-[#2563EB]" />
            <span className="text-[#5A5E69]">Page Views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-[#10B981]" />
            <span className="text-[#5A5E69]">Visitors</span>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full" style={{ height: 260 }} />
    </div>
  );
}
