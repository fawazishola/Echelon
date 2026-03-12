"use client";

import { Draggable } from "@hello-pangea/dnd";
import { formatCurrency, cn } from "@/lib/utils";
import { Clock, GripHorizontal, CheckCircle2 } from "lucide-react";

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
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-white rounded-2xl shadow-sm border border-slate-200/60 group hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden flex flex-col",
            snapshot.isDragging ? "shadow-2xl scale-105 rotate-1 z-50 ring-2 ring-indigo-500/50" : ""
          )}
        >
          {/* Colored Header Block */}
          <div className={cn(
            "p-4 pb-3 flex flex-col justify-between relative overflow-hidden",
            item.color_start ? `bg-gradient-to-br ${item.color_start} ${item.color_end}` : "bg-gradient-to-br from-indigo-500 to-violet-600"
          )}>
            {/* Subtle mesh/glass effect */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
            
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider border border-white/20">
                {item.provider_name}
              </div>
              <GripHorizontal className="text-white/40 group-hover:text-white/80 transition-colors cursor-grab active:cursor-grabbing w-4 h-4" />
            </div>
            <h4 className="font-bold text-white leading-tight mt-1 mb-1 text-sm md:text-base line-clamp-2 drop-shadow-sm relative z-10">
              {item.title}
            </h4>
          </div>

          {/* White Details Block */}
          <div className="p-4 pt-3 flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <span className="text-emerald-600 font-black text-lg">
                {formatCurrency(item.amount)}
              </span>
              {item.status === "Won" && (
                <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50" />
              )}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-slate-50 pt-3">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px] bg-slate-50 px-2 py-1 rounded-lg">
                <Clock size={14} className="text-amber-500" />
                <span>{item.deadline_days}d left</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px] bg-indigo-50/50 px-2 py-1 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                <span className="text-indigo-700 font-bold">{item.win_probability}% Compatible</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
