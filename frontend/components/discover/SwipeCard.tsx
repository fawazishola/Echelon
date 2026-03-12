"use client";

import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion";
import { X, Heart, Star, Clock, Info } from "lucide-react";
import { useState, useRef } from "react";
import { formatCurrency, cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";


// Mock Data Interface
export interface Scholarship {
  id: string;
  provider_name: string;
  provider_logo?: string;
  title: string;
  amount: number;
  deadline_days: number;
  win_probability: number;
  effort_hours: number;
  tags: string[];
  description: string;
  color_start?: string;
  color_end?: string;
}

interface SwipeCardProps {
  scholarship: Scholarship;
  onSwipe: (direction: "left" | "right", id: string) => void;
  index: number; // For z-index calculation
}

export function SwipeCard({ scholarship, onSwipe, index }: SwipeCardProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [constrain, setConstrain] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  // Rotation based on x position
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);

  // Labels opacity (optional UI enhancement)
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 500) {
      // Fire API call FIRST, then animate out
      onSwipe("right", scholarship.id);
      controls.start({ x: 500, opacity: 0, scale: 0.9, transition: { duration: 0.2 } });
    } else if (offset < -100 || velocity < -500) {
      onSwipe("left", scholarship.id);
      controls.start({ x: -500, opacity: 0, scale: 0.9, transition: { duration: 0.2 } });
    } else {
      controls.start({ x: 0, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  };

  // Determine probability color
  const probColor =
    scholarship.win_probability >= 40 ? "text-emerald-500 fill-emerald-500" :
      scholarship.win_probability >= 15 ? "text-amber-400 fill-amber-400" : "text-rose-500 fill-rose-500";

  const probBg =
    scholarship.win_probability >= 40 ? "bg-emerald-500" :
      scholarship.win_probability >= 15 ? "bg-amber-400" : "bg-rose-500";


  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none select-none touch-none"
      style={{
        zIndex: 100 - index,
        scale: index === 0 ? 1 : 0.95,
        y: index * 10,
        x,
        rotate,
        opacity
      }}
      drag={index === 0 ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
    >
      <div className="flex flex-col items-center gap-8 pointer-events-auto mt-[-30px]">
        {/* Card */}
        <div
          ref={cardRef}
          className={cn(
            "relative w-[90%] max-w-[360px] h-[440px] bg-white rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing",
            index > 0 && "pointer-events-none shadow-none bg-slate-50"
          )}
        >
          {/* Overlay Labels for Swipe */}
          {index === 0 && (
            <>
              <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 z-50 transform -rotate-12 border-4 border-emerald-500 rounded-lg px-4 py-1">
                <span className="text-emerald-500 font-black text-3xl tracking-widest uppercase">SAVE</span>
              </motion.div>
              <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 z-50 transform rotate-12 border-4 border-rose-500 rounded-lg px-4 py-1">
                <span className="text-rose-500 font-black text-3xl tracking-widest uppercase">SKIP</span>
              </motion.div>
            </>
          )}

          {/* Card Header with Gradient */}
          <div className={cn("h-[40%] p-6 flex flex-col justify-between relative transition-opacity duration-300",
            scholarship.color_start ? `bg-gradient-to-br ${scholarship.color_start} ${scholarship.color_end}` : "bg-gradient-to-br from-indigo-500 to-violet-600",
            index > 0 && "opacity-0"
          )}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-1.5 pr-3">
                <span className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-xs font-bold text-slate-900">
                  {scholarship.provider_name.substring(0, 2).toUpperCase()}
                </span>
                <span className="text-xs font-medium text-white truncate max-w-[100px]">{scholarship.provider_name}</span>
              </div>
              <span className="px-3 py-1 bg-amber-400 text-slate-900 text-xs font-bold rounded-full shadow-sm">
                {scholarship.deadline_days} days left
              </span>
            </div>

            <div className="text-white">
              <h2 className="text-4xl font-bold tracking-tight mb-1">{formatCurrency(scholarship.amount)}</h2>
              <h3 className="text-lg font-semibold leading-tight opacity-95 line-clamp-2">{scholarship.title}</h3>
            </div>
          </div>

          {/* Card Body */}
          <div className={cn("h-[60%] p-6 flex flex-col justify-between transition-opacity duration-300", 
            index > 0 && "opacity-0"
          )}>

            {/* Compatibility */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Compatibility</span>
                <span className={cn("text-2xl font-bold", probColor)}>{scholarship.win_probability}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-1000", probBg)} style={{ width: `${scholarship.win_probability}%` }}></div>
              </div>
            </div>

            {/* Tags & Time */}
            <div className="flex items-center gap-3 text-slate-400 text-sm mt-3 mb-3">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>~{scholarship.effort_hours}h</span>
              </div>
              {scholarship.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="bg-slate-100 px-2 py-0.5 rounded-md text-xs font-medium text-slate-600">{tag}</span>
              ))}
            </div>

            {/* Description Preview */}
            <p className="text-sm text-slate-500 line-clamp-3 mb-2">
              {scholarship.description}
            </p>
          </div>
        </div>

        {/* Action Buttons - OUTSIDE overflow-hidden card */}
        {index === 0 && (
          <div className="flex justify-center gap-6 relative z-[200]">
            <button
              aria-label="Skip scholarship"
              onClick={(e) => {
                e.stopPropagation();
                onSwipe("left", scholarship.id);
                controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
              }}
              className="w-14 h-14 rounded-full bg-white border border-rose-100 text-rose-500 shadow-lg shadow-rose-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
            >
              <X size={28} strokeWidth={3} />
            </button>
            <button
              aria-label="Save to favorites"
              onClick={(e) => {
                e.stopPropagation();
                onSwipe("right", scholarship.id);
                controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
              }}
              className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 text-amber-400 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform"
            >
              <Star size={18} fill="currentColor" />
            </button>
            <button
              aria-label="Save scholarship"
              onClick={(e) => {
                e.stopPropagation();
                onSwipe("right", scholarship.id);
                controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
              }}
              className="w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
            >
              <Heart size={26} fill="white" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
