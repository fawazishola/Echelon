"use client";

import { useEffect, useState } from "react";
import { KanbanBoard } from "@/components/kanban/Board";
import { fetchWithAuth } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Target, Trophy, ClipboardCheck } from "lucide-react";
import { Application } from "@/components/kanban/Card";

export default function TrackerPage() {
  const [stats, setStats] = useState({
    totalValue: 0,
    totalApps: 0,
    wonCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetchWithAuth("/applications");
        if (res.ok) {
          const data: Application[] = await res.json();
          const totalValue = data.reduce((sum, app) => sum + (app.amount || 0), 0);
          const wonCount = data.filter(app => app.status === "Won").length;
          setStats({
            totalValue,
            totalApps: data.length,
            wonCount
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen overflow-hidden">
      <header className="bg-slate-900 md:bg-transparent rounded-3xl md:rounded-none p-6 md:p-0 md:pt-4 mb-6 text-white md:text-slate-900 relative overflow-hidden shrink-0">
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight mb-2">My Pipeline</h1>
          <p className="text-slate-400 md:text-slate-500 font-medium text-sm">Manage your scholarship applications with ease.</p>
        </div>
      </header>

      {/* Summary Chips - Premium Look */}
      <div className="grid grid-cols-3 gap-3 mb-8 shrink-0">
        <div className="bg-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-200">
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className="opacity-80" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Tracked Value</span>
          </div>
          <div className="text-xl font-black">{formatCurrency(stats.totalValue)}</div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardCheck size={14} className="text-indigo-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Applications</span>
          </div>
          <div className="text-xl font-black text-slate-800">{stats.totalApps}</div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 shadow-sm shadow-emerald-50">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={14} className="text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Won</span>
          </div>
          <div className="text-xl font-black text-emerald-700">{stats.wonCount}</div>
        </div>
      </div>

      <div className="flex-1 -mx-4 overflow-hidden flex flex-col">
        <KanbanBoard />
      </div>
    </div>
  );
}
