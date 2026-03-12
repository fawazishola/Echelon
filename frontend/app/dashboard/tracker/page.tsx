"use client";

import { useEffect, useState } from "react";
import { KanbanBoard } from "@/components/kanban/Board";
import { fetchWithAuth } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, FileText, Eye } from "lucide-react";
import { Application } from "@/components/kanban/Card";

export default function TrackerPage() {
  const [stats, setStats] = useState({
    totalValue: 0,
    totalApps: 0,
    reviewCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetchWithAuth("/applications");
        if (res.ok) {
          const data: Application[] = await res.json();
          const visible = data.filter(app => ["Saved", "Applied", "In Review"].includes(app.status));
          const totalValue = visible.reduce((sum, app) => sum + (app.amount || 0), 0);
          const reviewCount = visible.filter(app => app.status === "In Review").length;
          setStats({
            totalValue,
            totalApps: visible.length,
            reviewCount
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="shrink-0 mb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Pipeline</h1>
        <p className="text-slate-400 text-xs font-medium mt-0.5">Track and manage your scholarship applications</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-5 shrink-0">
        {/* Total Value */}
        <div className="rounded-xl p-3.5 bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <TrendingUp size={12} className="text-slate-400" />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">Pipeline</span>
          </div>
          <div className="text-base font-extrabold text-emerald-600 leading-none">{formatCurrency(stats.totalValue)}</div>
        </div>

        {/* Applications */}
        <div className="rounded-xl p-3.5 bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <FileText size={12} className="text-slate-400" />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">Applications</span>
          </div>
          <div className="text-lg font-extrabold text-slate-800 leading-none">{stats.totalApps}</div>
        </div>

        {/* In Review */}
        <div className="rounded-xl p-3.5 bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <Eye size={12} className="text-amber-500" />
            <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">In Review</span>
          </div>
          <div className="text-lg font-extrabold text-slate-800 leading-none">{stats.reviewCount}</div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 -mx-4 overflow-hidden flex flex-col">
        <KanbanBoard />
      </div>
    </div>
  );
}
