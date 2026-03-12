"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface MascotProps {
  expression?: "happy" | "thinking" | "celebrating" | "sad" | "neutral";
  size?: number;
  className?: string;
  animate?: boolean;
}

export function Mascot({ expression = "neutral", size = 80, className, animate = true }: MascotProps) {
  const mascotRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!animate || !mascotRef.current) return;

    const ctx = gsap.context(() => {
      // Simple idle animation
      gsap.to(mascotRef.current, {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Expression application (rudimentary for SVG placeholder)
      if (expression === "celebrating") {
         gsap.to(mascotRef.current, {
           rotation: 360,
           duration: 1,
           ease: "back.out(1.7)"
         });
      }
    }, mascotRef);

    return () => ctx.revert();
  }, [expression, animate]);

  return (
    <div className={className} style={{ width: size, height: size }}>
       {/* Placeholder SVG Mascot - A simple Owl shape */}
      <svg
        ref={mascotRef}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        <circle cx="50" cy="50" r="45" fill="#4C6EF5" />
        <circle cx="35" cy="45" r="12" fill="white" />
        <circle cx="65" cy="45" r="12" fill="white" />
        <circle cx="35" cy="45" r="5" fill="#0F172A" />
        <circle cx="65" cy="45" r="5" fill="#0F172A" />
        <path
          d="M50 60L45 70H55L50 60Z"
          fill="#FFD43B"
          stroke="#F59F00"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Graduation Cap */}
         <rect x="25" y="15" width="50" height="10" fill="#0F172A" rx="2" />
         <path d="M20 20 L50 5 L80 20 L50 35 Z" fill="#0F172A" stroke="#1E293B" />
         <line x1="80" y1="20" x2="80" y2="45" stroke="#FFD43B" strokeWidth="2" />
         <circle cx="80" cy="45" r="3" fill="#FFD43B" />
      </svg>
    </div>
  );
}
