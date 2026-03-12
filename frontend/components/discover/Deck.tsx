"use client";

import { useState } from "react";
import { SwipeCard, Scholarship } from "./SwipeCard";
import { AnimatePresence } from "framer-motion";
import { Mascot } from "@/components/Mascot";
import { fetchWithAuth } from "@/lib/api";

interface DeckProps {
  scholarships: Scholarship[];
}

export function Deck({ scholarships: initialData }: DeckProps) {
  const [cards, setCards] = useState(initialData);

  const handleSwipe = async (direction: "left" | "right", id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));

    // API call to save/reject here
    try {
      console.log(`Sending swipe action: ${direction} for scholarship ${id}`);
      const res = await fetchWithAuth("/swipe", {
        method: "POST",
        body: JSON.stringify({
          scholarship_id: Number(id),
          action: direction === "right" ? "save" : "skip"
        })
      });
      console.log("Swipe API response:", res.status);
    } catch (e) {
      console.error("Failed to record swipe:", e);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <Mascot expression="celebrating" size={120} className="mb-6 animate-bounce" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">You've seen them all!</h2>
        <p className="text-slate-500 mb-8 max-w-xs">
          Check back tomorrow for new matches tailored to your profile.
        </p>
        <button
          onClick={() => window.location.reload()} // For demo purposes
          className="px-6 py-3 bg-white border border-slate-200 text-indigo-600 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          Refresh Feed
        </button>
      </div>
    );
  }

  // Render top 3 cards only for performance
  return (
    <div className="relative w-full h-[540px] flex justify-center items-start">
      <AnimatePresence>
        {cards.slice(0, 3).reverse().map((card, mapIndex, arr) => (
          <SwipeCard
            key={card.id}
            scholarship={card}
            index={arr.length - 1 - mapIndex}
            onSwipe={handleSwipe}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
