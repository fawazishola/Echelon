"use client";

import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { fetchWithAuth } from "@/lib/api";
import { KanbanColumn } from "./Column";
import { Application } from "./Card";

const COLUMNS = [
    { id: "Saved", title: "Saved", color: "bg-slate-100" },
    { id: "Applied", title: "Applied", color: "bg-blue-100" },
    { id: "In Review", title: "In Review", color: "bg-purple-100" },
    { id: "Round 1", title: "Round 1", color: "bg-amber-100" },
    { id: "Round 2", title: "Round 2", color: "bg-orange-100" },
    { id: "Won", title: "Won", color: "bg-emerald-100" },
    { id: "Lost", title: "Lost", color: "bg-rose-100" },
];

export function KanbanBoard() {
    const [items, setItems] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBrowser, setIsBrowser] = useState(false);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isBrowser) return null;

    return (
        <div className="w-full overflow-x-auto pb-8 hide-scrollbar">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 min-w-max h-full items-start px-4 py-2">
                    {COLUMNS.map((column) => (
                        <KanbanColumn
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            color={column.color}
                            items={items.filter(i => i.status === column.id)}
                        />
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
