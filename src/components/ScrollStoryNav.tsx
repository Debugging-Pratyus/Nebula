"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollStoryNavProps {
  activeSection: string;
}

const SECTIONS = [
  { id: "arrival", label: "01 // Arrival" },
  { id: "discovery", label: "02 // Discovery" },
  { id: "systems", label: "03 // Systems" },
  { id: "deep-space", label: "04 // Deep Space" },
  { id: "universe", label: "05 // Exploration" },
];

export default function ScrollStoryNav({ activeSection }: ScrollStoryNavProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setPercentage(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  return (
    <>
      {/* Top Fixed Global Progress Line */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-[2px] origin-left bg-gradient-to-r from-violet-glow via-ice to-white shadow-[0_0_10px_rgba(94,231,255,0.8)]"
        style={{ scaleX }}
      />

      {/* Floating Right Side Orbital Coordinates HUD */}
      <nav
        aria-label="Story Progression"
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
      >
        <div className="mb-2 font-mono text-[10px] tracking-widest text-ice/80">
          TRAJECTORY {percentage}%
        </div>
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className="group flex items-center gap-3 py-1 outline-none transition-all"
            >
              <span
                className={`text-[11px] font-mono tracking-widest uppercase transition-all duration-300 ${
                  isActive
                    ? "text-ice opacity-100 font-medium translate-x-0"
                    : "text-dim opacity-40 hover:opacity-80 group-hover:text-mist translate-x-1"
                }`}
              >
                {sec.label}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? "h-2 w-2 bg-ice shadow-[0_0_8px_rgba(94,231,255,0.9)]"
                    : "h-1.5 w-1.5 bg-white/20 group-hover:bg-white/50"
                }`}
              />
            </a>
          );
        })}
      </nav>
    </>
  );
}
