"use client";

import { Droppable } from "@hello-pangea/dnd";
import { KanbanCard, Application } from "./Card";
import { cn } from "@/lib/utils";

interface ColumnProps {
  id: string;
  title: string;
  items: Application[];
  color: string;
}

export function KanbanColumn({ id, title, items, color }: ColumnProps) {
  return (
    <div className={cn(
      "w-[300px] flex-shrink-0 flex flex-col max-h-[calc(100vh-280px)] rounded-3xl overflow-hidden bg-slate-50/50 border border-slate-200/40",
      items.length > 0 ? "shadow-sm" : ""
    )}>
      {/* Column Header */}
      <div className="p-4 px-5 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className={cn("w-2 h-2 rounded-full", 
            id === "Saved" ? "bg-slate-400" :
            id === "Applied" ? "bg-blue-500" :
            id === "In Review" ? "bg-purple-500" :
            id === "Won" ? "bg-emerald-500" :
            id === "Lost" ? "bg-rose-500" : "bg-amber-500"
          )}></div>
          <h3 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h3>
        </div>
        <span className="bg-slate-200/60 tabular-nums px-2.5 py-0.5 rounded-full text-[10px] font-black text-slate-500">
          {items.length}
        </span>
      </div>

      {/* Drop Zone */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "p-4 flex-1 overflow-y-auto space-y-4 min-h-[200px] transition-all duration-300 hide-scrollbar",
              snapshot.isDraggingOver ? "bg-indigo-50/30" : ""
            )}
          >
            {items.map((item, index) => (
              <KanbanCard key={item.id} item={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
