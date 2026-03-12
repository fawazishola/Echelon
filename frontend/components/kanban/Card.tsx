"use client";

import { Draggable } from "@hello-pangea/dnd";
import { formatCurrency, cn } from "@/lib/utils";
import { Clock } from "lucide-react";

// Tailwind class → hex color map (Tailwind purges dynamic classes)
const COLOR_MAP: Record<string, string> = {
  "from-indigo-500": "#6366f1", "to-violet-600": "#7c3aed", "from-indigo-600": "#4f46e5",
  "to-violet-500": "#8b5cf6", "to-blue-500": "#3b82f6", "to-blue-700": "#1d4ed8",
  "to-blue-800": "#1e40af", "to-indigo-500": "#6366f1",
  "from-blue-600": "#2563eb", "to-cyan-500": "#06b6d4", "to-cyan-600": "#0891b2",
  "from-blue-700": "#1d4ed8",
  "from-slate-800": "#1e293b", "to-slate-600": "#475569",
  "from-slate-700": "#334155", "to-zinc-600": "#52525b",
  "from-slate-900": "#0f172a", "to-black": "#000000",
  "from-rose-500": "#f43f5e", "to-pink-600": "#db2777", "to-pink-500": "#ec4899",
  "from-amber-500": "#f59e0b", "to-orange-500": "#f97316", "to-orange-600": "#ea580c",
  "from-orange-500": "#f97316", "to-red-600": "#dc2626",
  "from-neutral-700": "#404040", "to-neutral-900": "#171717",
  "from-purple-600": "#9333ea", "to-fuchsia-500": "#d946ef", "to-purple-700": "#7e22ce",
  "from-purple-800": "#6b21a8", "to-purple-600": "#9333ea",
  "from-cyan-700": "#0e7490",
  "from-teal-500": "#14b8a6", "from-teal-600": "#0d9488", "to-emerald-400": "#34d399", "to-emerald-500": "#10b981",
  "from-violet-600": "#7c3aed",
  "from-emerald-600": "#059669", "from-emerald-700": "#047857", "to-teal-500": "#14b8a6", "to-green-600": "#16a34a", "to-green-700": "#15803d",
  "from-red-500": "#ef4444", "from-red-600": "#dc2626", "to-yellow-500": "#eab308", "to-red-400": "#f87171",
  "from-zinc-700": "#3f3f46",
  "from-fuchsia-600": "#c026d3",
};

export interface Application {
  id: string;
  scholarship_id: string;
  status: string;
  provider_name: string;
  title: string;
  amount: number;
  deadline_days: number;
  win_probability: number;
  color_start?: string;
  color_end?: string;
}

interface KanbanCardProps {
  item: Application;
  index: number;
}

export function KanbanCard({ item, index }: KanbanCardProps) {
  const c1 = COLOR_MAP[item.color_start || "from-indigo-500"] || "#6366f1";
  const c2 = COLOR_MAP[item.color_end || "to-violet-600"] || "#7c3aed";

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-white rounded-lg border border-slate-200/60 group hover:shadow-md hover:border-slate-300/60 transition-all duration-200 overflow-hidden cursor-grab active:cursor-grabbing",
            snapshot.isDragging ? "shadow-xl scale-[1.02] ring-2 ring-indigo-500/40 rotate-1" : "shadow-sm"
          )}
        >
          {/* Thin gradient accent bar */}
          <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, ${c1}, ${c2})` }}></div>

          <div className="p-3.5">
            {/* Provider + Amount row */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate max-w-[60%]">
                {item.provider_name}
              </span>
              <span className="text-sm font-extrabold text-slate-800">
                {formatCurrency(item.amount)}
              </span>
            </div>

            {/* Title */}
            <h4 className="font-semibold text-slate-700 text-[13px] leading-snug line-clamp-2 mb-3">
              {item.title}
            </h4>

            {/* Footer: deadline + compatibility */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                <Clock size={12} />
                <span>{item.deadline_days}d left</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={cn("w-1.5 h-1.5 rounded-full",
                  item.win_probability >= 40 ? "bg-emerald-500" :
                  item.win_probability >= 15 ? "bg-amber-400" : "bg-rose-400"
                )}></div>
                <span className={cn("text-[11px] font-bold",
                  item.win_probability >= 40 ? "text-emerald-600" :
                  item.win_probability >= 15 ? "text-amber-600" : "text-rose-500"
                )}>{item.win_probability}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
