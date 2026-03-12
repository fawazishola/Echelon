"use client";

import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { fetchWithAuth } from "@/lib/api";
import { KanbanColumn } from "./Column";
import { Application } from "./Card";
import { cn } from "@/lib/utils";

const COLUMNS = [
    { id: "Saved", title: "Saved", dot: "bg-slate-400", ring: "ring-slate-300" },
    { id: "Applied", title: "Applied", dot: "bg-blue-500", ring: "ring-blue-300" },
    { id: "In Review", title: "In Review", dot: "bg-amber-500", ring: "ring-amber-300" },
];

export function KanbanBoard() {
    const [items, setItems] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBrowser, setIsBrowser] = useState(false);
    const [activeTab, setActiveTab] = useState("Saved");

    useEffect(() => setIsBrowser(true), []);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await fetchWithAuth("/applications");
                if (res.ok) {
                    const data = await res.json();
                    setItems(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const newStatus = destination.droppableId;

        // Optimistic UI update
        setItems((prev) =>
            prev.map(item => item.id === draggableId ? { ...item, status: newStatus } : item)
        );

        // Switch to the destination tab
        setActiveTab(newStatus);

        try {
            await fetchWithAuth(`/applications/${draggableId}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus })
            });
        } catch (e) {
            console.error("Failed to update status", e);
            const res = await fetchWithAuth("/applications");
            if (res.ok) setItems(await res.json());
        }
    };

    const getCount = (colId: string) => items.filter(i => i.status === colId).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-200 border-t-indigo-600"></div>
                    <span className="text-xs text-slate-400 font-medium">Loading applications...</span>
                </div>
            </div>
        );
    }

    if (!isBrowser) return null;

    const activeColumn = COLUMNS.find(c => c.id === activeTab) || COLUMNS[0];

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tab Bar */}
            <div className="flex items-center gap-1 px-4 pb-3 shrink-0">
                {COLUMNS.map((col) => {
                    const count = getCount(col.id);
                    const isActive = activeTab === col.id;
                    return (
                        <button
                            key={col.id}
                            onClick={() => setActiveTab(col.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200",
                                isActive
                                    ? "bg-white shadow-sm border border-slate-200/80 text-slate-800"
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <div className={cn("w-1.5 h-1.5 rounded-full", col.dot, isActive && "ring-2 ring-offset-1 " + col.ring)}></div>
                            {col.title}
                            <span className={cn(
                                "tabular-nums px-1.5 py-0.5 rounded-md text-[10px] font-bold",
                                isActive ? "bg-slate-100 text-slate-600" : "text-slate-300"
                            )}>{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Active Column */}
            <div className="flex-1 overflow-hidden px-4">
                <DragDropContext onDragEnd={onDragEnd}>
                    <KanbanColumn
                        key={activeColumn.id}
                        id={activeColumn.id}
                        title={activeColumn.title}
                        color=""
                        items={items.filter(i => i.status === activeColumn.id)}
                        fullWidth
                    />
                </DragDropContext>
            </div>
        </div>
    );
}
