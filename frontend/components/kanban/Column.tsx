"use client";

import { Droppable } from "@hello-pangea/dnd";
import { KanbanCard, Application } from "./Card";
import { cn } from "@/lib/utils";

interface ColumnProps {
  id: string;
  title: string;
  items: Application[];
  color: string;
  fullWidth?: boolean;
}

const STATUS_CONFIG: Record<string, { dot: string; bg: string; border: string }> = {
  "Saved": { dot: "bg-slate-400", bg: "bg-slate-50", border: "border-slate-200/50" },
  "Applied": { dot: "bg-blue-500", bg: "bg-blue-50/30", border: "border-blue-200/40" },
  "In Review": { dot: "bg-amber-500", bg: "bg-amber-50/30", border: "border-amber-200/40" },
};

export function KanbanColumn({ id, title, items, color, fullWidth }: ColumnProps) {
  const config = STATUS_CONFIG[id] || STATUS_CONFIG["Saved"];

  return (
    <div className={cn(
      "flex flex-col rounded-xl overflow-hidden border bg-white/60 backdrop-blur-sm",
      fullWidth ? "w-full h-full" : "w-[280px] flex-shrink-0 max-h-[60vh]",
      config.border
    )}>
      {/* Column Header - hidden in fullWidth/tab mode */}
      {!fullWidth && (
      <div className="px-4 py-3 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className={cn("w-2 h-2 rounded-full ring-2 ring-offset-1",
            config.dot,
            id === "Saved" ? "ring-slate-200" : id === "Applied" ? "ring-blue-200" : "ring-amber-200"
          )}></div>
          <h3 className="font-semibold text-slate-700 text-sm">{title}</h3>
        </div>
        <span className="bg-slate-100 tabular-nums px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-500">
          {items.length}
        </span>
      </div>
      )}
      {fullWidth && <div className="h-1"></div>}

      {/* Drop Zone */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "p-3 flex-1 overflow-y-auto space-y-3 min-h-[180px] transition-colors duration-200 hide-scrollbar",
              snapshot.isDraggingOver ? "bg-indigo-50/40" : config.bg
            )}
          >
            {items.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-300 text-lg">0</span>
                </div>
                <span className="text-slate-300 text-xs font-medium">No scholarships here yet</span>
              </div>
            )}
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
