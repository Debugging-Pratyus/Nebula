"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Compass,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Info,
  Layers,
  Thermometer,
  RotateCw,
} from "lucide-react";
import { PLANETS } from "@/data/planets";

// Dynamically import Three.js Canvas to prevent SSR canvas issues in Next.js
const PlanetCanvas = dynamic(() => import("@/components/PlanetCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-ice/20 border-t-ice" />
        <span className="text-xs uppercase tracking-[0.3em] text-dim">
          Initializing Orbital Telemetry...
        </span>
      </div>
    </div>
  ),
});

export default function UniverseExplorer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const reduce = useReducedMotion();

  const currentPlanet = PLANETS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PLANETS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PLANETS.length) % PLANETS.length);
  };

  return (
    <section id="universe" className="relative min-h-screen w-full px-6 py-20 md:px-12">
      {/* Background ambient lighting halo that matches current planet */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[130px] transition-all duration-1000 ease-out"
        style={{ background: currentPlanet.glowColor }}
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-white/[0.08] pb-6 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-ice">
              <Compass className="h-4 w-4 text-ice" />
              <span>Deep Space Observatory</span>
            </div>
            <h2 className="mt-2 font-display text-4xl font-light text-white md:text-5xl">
              Sector <span className="italic text-violet-glow">Epsilon-9</span>
            </h2>
          </div>

          {/* Quick Planet Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {PLANETS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setCurrentIndex(idx)}
                className={`group relative rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                  currentIndex === idx
                    ? "border border-ice/50 bg-white/[0.08] text-white shadow-[0_0_20px_rgba(94,231,255,0.2)]"
                    : "border border-transparent text-dim hover:border-white/10 hover:text-mist"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive 3D Stage & Telemetry Grid */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Main 3D Canvas Box (7 columns on large screens) */}
          <div className="relative order-2 h-[420px] w-full rounded-3xl border border-white/[0.08] bg-black/40 backdrop-blur-md sm:h-[500px] lg:order-1 lg:col-span-7 lg:h-[620px]">
            {/* Interactive Badge Hint */}
            <div className="pointer-events-none absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3.5 py-1 text-[11px] uppercase tracking-[0.25em] text-mist/80 backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-ice animate-pulse" />
              <span>Interactive 3D Sphere • Drag to Orbit</span>
            </div>

            {/* Quick Actions Top Right */}
            <div className="absolute right-6 top-6 z-10 flex gap-2">
              <button
                onClick={() => setDetailOpen(!detailOpen)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-mist transition-colors hover:border-ice/50 hover:text-white backdrop-blur-md"
                title="Toggle Telemetry Dossier"
              >
                <Info className="h-3.5 w-3.5 text-ice" />
                <span className="hidden sm:inline">Dossier</span>
              </button>
            </div>

            {/* The 3D Scene */}
            <PlanetCanvas
              key={currentPlanet.id}
              planet={currentPlanet}
              onPlanetClick={() => setDetailOpen(true)}
            />

            {/* Navigation Controls bottom center */}
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/10 bg-black/60 px-5 py-2.5 backdrop-blur-md">
              <button
                onClick={handlePrev}
                aria-label="Previous Planet"
                className="rounded-full p-1.5 text-mist transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="text-center font-mono text-xs tracking-wider text-ice">
                0{currentIndex + 1} / 0{PLANETS.length}
              </div>
              <button
                onClick={handleNext}
                aria-label="Next Planet"
                className="rounded-full p-1.5 text-mist transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Planet Telemetry & Overview Panel (5 columns on large screens) */}
          <div className="order-1 flex flex-col justify-center lg:order-2 lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPlanet.id}
                initial={reduce ? {} : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? {} : { opacity: 0, x: -20 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <span className="text-xs uppercase tracking-[0.35em] text-ice">
                    {currentPlanet.classification}
                  </span>
                  <h3 className="mt-1 font-display text-4xl font-light text-white sm:text-5xl">
                    {currentPlanet.name}
                  </h3>
                  <p className="mt-1 text-sm italic tracking-wide text-violet-glow">
                    &ldquo;{currentPlanet.tagline}&rdquo;
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-dim sm:text-base">
                  {currentPlanet.description}
                </p>

                {/* Key Telemetry Metrics Matrix */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-dim">
                      <Layers className="h-3.5 w-3.5 text-ice" />
                      <span>Diameter</span>
                    </div>
                    <div className="mt-1 font-mono text-base font-light text-white">
                      {currentPlanet.diameter}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-dim">
                      <Thermometer className="h-3.5 w-3.5 text-ice" />
                      <span>Temp</span>
                    </div>
                    <div className="mt-1 font-mono text-base font-light text-white">
                      {currentPlanet.surfaceTemp}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-dim">
                      <RotateCw className="h-3.5 w-3.5 text-ice" />
                      <span>Orbit</span>
                    </div>
                    <div className="mt-1 font-mono text-base font-light text-white">
                      {currentPlanet.orbitalPeriod}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-dim">
                      <Compass className="h-3.5 w-3.5 text-ice" />
                      <span>Distance</span>
                    </div>
                    <div className="mt-1 font-mono text-base font-light text-white">
                      {currentPlanet.distance}
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => setDetailOpen(true)}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-ice/30 bg-ice/10 py-3.5 text-xs uppercase tracking-[0.3em] text-white transition-all duration-300 hover:border-ice hover:bg-ice/20 hover:shadow-[0_0_30px_rgba(94,231,255,0.25)] sm:w-auto sm:px-8"
                  >
                    <span>Inspect Scientific Dossier</span>
                    <Maximize2 className="h-3.5 w-3.5 text-ice" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Detailed Scientific Dossier Drawer / Modal */}
        <AnimatePresence>
          {detailOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-lg"
              onClick={() => setDetailOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#070918]/95 p-6 shadow-2xl backdrop-blur-xl md:p-8"
              >
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-ice">
                      Planetary Archive #{currentPlanet.id.toUpperCase()}
                    </span>
                    <h3 className="font-display text-3xl font-light text-white">
                      {currentPlanet.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setDetailOpen(false)}
                    className="rounded-full border border-white/10 p-2 text-dim transition-colors hover:border-white/30 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-6 text-sm text-dim">
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.25em] text-mist">
                      Historical Lore
                    </h4>
                    <p className="mt-2 italic leading-relaxed text-mist/90">
                      &ldquo;{currentPlanet.lore}&rdquo;
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-[0.25em] text-mist">
                      Atmospheric Composition
                    </h4>
                    <p className="mt-1 font-mono text-xs text-ice">
                      {currentPlanet.atmosphereComposition}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase tracking-[0.25em] text-mist">
                      Notable Geographic Features
                    </h4>
                    <ul className="mt-2 list-inside list-disc space-y-1.5 text-mist/80">
                      {currentPlanet.features.map((feat, i) => (
                        <li key={i}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setDetailOpen(false)}
                    className="rounded-full border border-white/20 px-6 py-2 text-xs uppercase tracking-[0.25em] text-white hover:bg-white/10"
                  >
                    Close Dossier
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
