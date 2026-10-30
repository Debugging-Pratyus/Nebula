"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Compass,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Thermometer,
  RotateCw,
  Rocket,
  ShieldAlert,
  ArrowLeft,
  Sliders,
  Globe,
  Radio,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkle,
} from "lucide-react";
import { SOLAR_PLANETS } from "@/data/solarSystem";
import { EnvironmentMode } from "@/components/SolarSystemCanvas";

// Dynamic canvas imports to prevent SSR hydration mismatches
const SolarSystemCanvas = dynamic(
  () => import("@/components/SolarSystemCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-ice/20 border-t-ice" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-dim">
            Synthesizing Heliocentric Coordinates...
          </span>
        </div>
      </div>
    ),
  }
);

const DetailedPlanetCanvas = dynamic(
  () => import("@/components/DetailedPlanetCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ice/20 border-t-ice" />
      </div>
    ),
  }
);

export default function SolarSystemExplorer() {
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [isTraveling, setIsTraveling] = useState(false);
  const [explorationTab, setExplorationTab] = useState<"overview" | "structure" | "missions" | "mysteries">("overview");
  
  // Customization State (Priority 5)
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [orbitSpeedMultiplier, setOrbitSpeedMultiplier] = useState(1);
  const [environmentMode, setEnvironmentMode] = useState<EnvironmentMode>("milkyway");
  const [cinematicMode, setCinematicMode] = useState(false);
  const [resetViewTrigger, setResetViewTrigger] = useState(0);

  const reduce = useReducedMotion();
  const selectedPlanet = SOLAR_PLANETS.find((p) => p.id === selectedPlanetId);

  // Smooth cinematic travel sequence
  const handleSelectPlanet = (planetId: string) => {
    if (!planetId) {
      handleReturnToSystem();
      return;
    }
    setIsTraveling(true);
    setSelectedPlanetId(planetId);
    setExplorationTab("overview");

    setTimeout(() => {
      setIsTraveling(false);
    }, reduce ? 100 : 650);
  };

  // Priority 4: Functional Return / Reset to overview
  const handleReturnToSystem = () => {
    setIsTraveling(true);
    setTimeout(() => {
      setSelectedPlanetId(null);
      setResetViewTrigger((c) => c + 1);
      setIsTraveling(false);
    }, reduce ? 50 : 400);
  };

  const handleNextPlanet = () => {
    if (!selectedPlanet) return;
    const currentIndex = SOLAR_PLANETS.findIndex((p) => p.id === selectedPlanet.id);
    const nextPlanet = SOLAR_PLANETS[(currentIndex + 1) % SOLAR_PLANETS.length];
    handleSelectPlanet(nextPlanet.id);
  };

  const handlePrevPlanet = () => {
    if (!selectedPlanet) return;
    const currentIndex = SOLAR_PLANETS.findIndex((p) => p.id === selectedPlanet.id);
    const prevPlanet = SOLAR_PLANETS[(currentIndex - 1 + SOLAR_PLANETS.length) % SOLAR_PLANETS.length];
    handleSelectPlanet(prevPlanet.id);
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-void">
      {/* Top Controls & Navigation Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-void/75 px-6 py-4 backdrop-blur-md transition-transform duration-500 md:px-12 ${
          cinematicMode ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Priority 4: Functional Logo Button returning to Solar System Overview */}
          <button
            type="button"
            onClick={handleReturnToSystem}
            aria-label="Return to Solar System Overview"
            className="group flex items-center gap-2 text-sm font-light tracking-[0.45em] text-mist outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-ice"
          >
            <span>NEBULA</span>
            <span className="block h-1.5 w-1.5 rounded-full bg-ice opacity-60 transition-transform group-hover:scale-125 group-hover:opacity-100" />
          </button>
          <span className="text-white/20">/</span>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ice">
            <Compass className="h-3.5 w-3.5 text-ice" />
            <span>{selectedPlanet ? selectedPlanet.name : "Solar System Overview"}</span>
          </div>
        </div>

        {/* Global Controls & Environmental Customization (Priority 5) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {selectedPlanet ? (
            <button
              onClick={handleReturnToSystem}
              className="flex items-center gap-2 rounded-full border border-ice/40 bg-ice/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-white transition-all hover:border-ice hover:bg-ice/20"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-ice" />
              <span>Solar Overview</span>
            </button>
          ) : (
            <>
              {/* Environment Palette Switcher */}
              <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1 md:flex">
                {(
                  [
                    { id: "milkyway", label: "Milky Way" },
                    { id: "deepspace", label: "Deep Cyan" },
                    { id: "orion", label: "Orion Veil" },
                  ] as const
                ).map((env) => (
                  <button
                    key={env.id}
                    onClick={() => setEnvironmentMode(env.id)}
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-all ${
                      environmentMode === env.id
                        ? "bg-white/15 text-white"
                        : "text-dim hover:text-mist"
                    }`}
                  >
                    {env.label}
                  </button>
                ))}
              </div>

              {/* Orbit Toggle */}
              <button
                onClick={() => setShowOrbits(!showOrbits)}
                title="Toggle Planetary Orbit Paths"
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                  showOrbits
                    ? "border-white/20 bg-white/10 text-ice"
                    : "border-white/5 bg-transparent text-dim hover:text-white"
                }`}
              >
                <span>Orbits</span>
              </button>

              {/* Labels Toggle */}
              <button
                onClick={() => setShowLabels(!showLabels)}
                title="Toggle Planet Labels"
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                  showLabels
                    ? "border-white/20 bg-white/10 text-ice"
                    : "border-white/5 bg-transparent text-dim hover:text-white"
                }`}
              >
                {showLabels ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </button>

              {/* Reset View Button */}
              <button
                onClick={() => setResetViewTrigger((c) => c + 1)}
                title="Reset Camera View"
                className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1.5 text-mist hover:text-white hover:border-white/30"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </>
          )}

          {/* Cinematic Mode Toggle */}
          <button
            onClick={() => setCinematicMode(!cinematicMode)}
            title="Toggle Cinematic Mode (Hide Interface)"
            className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-mist hover:border-ice/50 hover:text-white"
          >
            <Sparkle className="h-3 w-3 text-ice" />
            <span className="hidden sm:inline">Cinema</span>
          </button>
        </div>
      </header>

      {/* Cinematic Exit Button when in Cinema Mode */}
      {cinematicMode && (
        <button
          onClick={() => setCinematicMode(false)}
          className="fixed top-6 right-6 z-40 flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-4 py-2 font-mono text-xs uppercase tracking-wider text-white backdrop-blur-md hover:border-ice"
        >
          <span>Exit Cinema Mode</span>
        </button>
      )}

      {/* Main 3D Stage Container */}
      <div className="relative h-screen w-full pt-16">
        {/* Dynamic Background Glow for Selected World */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[150px] transition-colors duration-1000"
          style={{
            background: selectedPlanet ? selectedPlanet.glowColor : "#ffaa00",
          }}
        />

        {/* VIEW A: Complete Navigable Solar System (Overview) */}
        {!selectedPlanet && (
          <div className="relative h-full w-full">
            <SolarSystemCanvas
              selectedPlanetId={selectedPlanetId}
              onSelectPlanet={handleSelectPlanet}
              speedMultiplier={orbitSpeedMultiplier}
              showOrbits={showOrbits}
              showLabels={showLabels}
              environmentMode={environmentMode}
              resetViewTrigger={resetViewTrigger}
            />

            {/* Priority 6: Heroic Header Overlay on Opening Screen */}
            <div
              className={`pointer-events-none absolute left-6 top-6 z-20 max-w-lg transition-opacity duration-500 md:left-12 ${
                cinematicMode ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-ice">
                <Sparkles className="h-3.5 w-3.5 text-ice animate-pulse" />
                <span>Navigable 3D Universe</span>
              </div>
              <h1 className="mt-2 font-display text-4xl font-light text-white md:text-5xl">
                The Solar System
              </h1>
              <p className="mt-1 text-xs italic tracking-wider text-mist/80 md:text-sm">
                Traverse between worlds from Sol to the ice boundary.
              </p>
            </div>

            {/* Quick Planet Navigation Strip */}
            <div
              className={`absolute left-1/2 top-6 z-20 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/60 p-1.5 backdrop-blur-md transition-opacity duration-500 xl:flex ${
                cinematicMode ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              {SOLAR_PLANETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPlanet(p.id)}
                  className="rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-mist transition-colors hover:bg-white/15 hover:text-white"
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Bottom Controls: Speed Multiplier */}
            <div
              className={`absolute right-6 bottom-8 z-20 flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-md transition-opacity duration-500 ${
                cinematicMode ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <Sliders className="h-3.5 w-3.5 text-ice" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-mist">
                Speed {orbitSpeedMultiplier}x
              </span>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={orbitSpeedMultiplier}
                onChange={(e) => setOrbitSpeedMultiplier(parseFloat(e.target.value))}
                aria-label="Orbit Simulation Speed"
                className="h-1 w-20 cursor-pointer accent-ice"
              />
            </div>
          </div>
        )}

        {/* VIEW B: Planet Exploration & Scientific Dossier */}
        {selectedPlanet && (
          <div className="relative grid h-full w-full grid-cols-1 items-center px-6 md:px-12 lg:grid-cols-12">
            {/* Left 3D Globe Stage (7 Columns) */}
            <div className="relative h-[380px] w-full sm:h-[460px] lg:col-span-7 lg:h-[78vh]">
              {/* Interactive Orbit Hint */}
              <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3.5 py-1 text-[11px] uppercase tracking-[0.25em] text-mist/90 backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-ice animate-pulse" />
                <span>Interactive Globe • Drag to inspect</span>
              </div>

              {/* 3D Planet Canvas */}
              <DetailedPlanetCanvas planet={selectedPlanet} />

              {/* Planet Switching Bar */}
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/10 bg-black/70 px-5 py-2 backdrop-blur-md">
                <button
                  onClick={handlePrevPlanet}
                  aria-label="Previous Planet"
                  className="rounded-full p-1.5 text-mist transition-colors hover:bg-white/10 hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="text-center font-mono text-xs tracking-wider text-ice">
                  {selectedPlanet.order} / 08 • {selectedPlanet.name}
                </div>
                <button
                  onClick={handleNextPlanet}
                  aria-label="Next Planet"
                  className="rounded-full p-1.5 text-mist transition-colors hover:bg-white/10 hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Right Detailed Scientific Telemetry Dossier (5 Columns) */}
            <div className="flex h-full max-h-[82vh] flex-col overflow-y-auto pr-2 lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedPlanet.id}
                  initial={reduce ? {} : { opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? {} : { opacity: 0, x: -25 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6"
                >
                  {/* Planet Title & Core Identity */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-[0.3em] text-ice">
                        {selectedPlanet.type} • Distance: {selectedPlanet.distanceFromSunAU} AU
                      </span>
                    </div>
                    <h2 className="mt-1 font-display text-4xl font-light text-white sm:text-5xl">
                      {selectedPlanet.name}
                    </h2>
                    <p className="mt-1 text-sm italic tracking-wide text-violet-glow">
                      &ldquo;{selectedPlanet.tagline}&rdquo;
                    </p>
                  </div>

                  {/* Scientific Dossier Navigation Tabs */}
                  <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
                    {(
                      [
                        { id: "overview", label: "Overview" },
                        { id: "structure", label: "Structure" },
                        { id: "missions", label: "Missions" },
                        { id: "mysteries", label: "Mysteries" },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setExplorationTab(tab.id)}
                        className={`rounded-full px-3.5 py-1 text-xs uppercase tracking-[0.2em] transition-all ${
                          explorationTab === tab.id
                            ? "border border-ice/60 bg-ice/15 text-white"
                            : "border border-transparent text-dim hover:text-mist"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab 1: Overview & Metrics */}
                  {explorationTab === "overview" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-5"
                    >
                      <p className="text-sm leading-relaxed text-dim">
                        {selectedPlanet.overview}
                      </p>

                      {/* Scientific Telemetry Matrix */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 backdrop-blur-sm">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-dim">
                            <Globe className="h-3.5 w-3.5 text-ice" />
                            <span>Diameter</span>
                          </div>
                          <div className="mt-1 font-mono text-sm text-white">
                            {selectedPlanet.diameterKm.toLocaleString()} km
                          </div>
                          <div className="text-[10px] text-dim">{selectedPlanet.diameterRelative}</div>
                        </div>

                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 backdrop-blur-sm">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-dim">
                            <Thermometer className="h-3.5 w-3.5 text-ice" />
                            <span>Surface Temp</span>
                          </div>
                          <div className="mt-1 font-mono text-sm text-white">
                            {selectedPlanet.surfaceTempC}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 backdrop-blur-sm">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-dim">
                            <RotateCw className="h-3.5 w-3.5 text-ice" />
                            <span>Orbit Period</span>
                          </div>
                          <div className="mt-1 font-mono text-sm text-white">
                            {selectedPlanet.orbitalPeriodDays} Earth Days
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 backdrop-blur-sm">
                          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-dim">
                            <Layers className="h-3.5 w-3.5 text-ice" />
                            <span>Moons</span>
                          </div>
                          <div className="mt-1 font-mono text-sm text-white">
                            {selectedPlanet.moonsCount} Identified
                          </div>
                        </div>
                      </div>

                      {/* Notable Features */}
                      <div>
                        <h4 className="text-xs uppercase tracking-[0.25em] text-mist">
                          Notable Surface Features
                        </h4>
                        <div className="mt-3 flex flex-col gap-2">
                          {selectedPlanet.features.map((feat) => (
                            <div
                              key={feat.id}
                              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-medium text-ice">
                                  {feat.name}
                                </span>
                                <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] uppercase text-dim">
                                  {feat.category}
                                </span>
                              </div>
                              <p className="mt-1 text-xs leading-relaxed text-dim">
                                {feat.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 2: Internal Structure & Atmosphere */}
                  {explorationTab === "structure" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-5 text-sm"
                    >
                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ice">
                          <Layers className="h-4 w-4 text-ice" />
                          <span>Internal Structure & Core</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-mist/90">
                          {selectedPlanet.internalStructure}
                        </p>
                        <div className="mt-3 border-t border-white/5 pt-2 text-[11px] font-mono text-dim">
                          Core Composition: {selectedPlanet.coreComposition}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ice">
                          <Radio className="h-4 w-4 text-ice" />
                          <span>Atmospheric Profile & Weather</span>
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-mist/90">
                          {selectedPlanet.atmosphereNotes}
                        </p>
                        <div className="mt-3 border-t border-white/5 pt-2 text-[11px] font-mono text-dim">
                          Chemical Makeup: {selectedPlanet.atmosphereComposition}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Tab 3: Missions & Spacecraft Exploration */}
                  {explorationTab === "missions" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-3"
                    >
                      {selectedPlanet.missions.map((m, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Rocket className="h-3.5 w-3.5 text-ice" />
                              <span className="font-mono text-xs font-medium text-white">
                                {m.name}
                              </span>
                            </div>
                            <span className="font-mono text-[11px] text-ice/80">
                              {m.agency} • {m.year}
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-dim">
                            {m.significance}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Tab 4: Open Scientific Mysteries & Questions */}
                  {explorationTab === "mysteries" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-3"
                    >
                      <div className="mb-1 text-xs uppercase tracking-wider text-dim">
                        Active Frontiers of Planetary Astrophysics
                      </div>
                      {selectedPlanet.mysteries.map((mystery, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-4"
                        >
                          <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                            <span>Unsolved Scientific Query #{idx + 1}</span>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-mist/90">
                            {mystery}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Cinematic Travel Flash / HUD Transition Overlay */}
      <AnimatePresence>
        {isTraveling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-ice/20 border-t-ice" />
              <div className="font-mono text-xs uppercase tracking-[0.4em] text-ice">
                Traversing Planetary Orbit Vector...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
