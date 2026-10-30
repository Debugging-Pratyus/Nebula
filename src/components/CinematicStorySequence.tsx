"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Sparkles, Orbit, Radio, ArrowDown, ChevronRight, Sliders } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { PLANETS } from "@/data/planets";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CinematicStoryCanvas = dynamic(
  () => import("@/components/CinematicStoryCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ice/20 border-t-ice" />
      </div>
    ),
  }
);

interface CinematicStorySequenceProps {
  onActiveSectionChange?: (sectionId: string) => void;
}

export default function CinematicStorySequence({
  onActiveSectionChange,
}: CinematicStorySequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [storyPlanetIndex, setStoryPlanetIndex] = useState(0);

  // Feature 3: Draggable / Scrub-able meaningful control (Gravitational Warp Core)
  const [gravityWarp, setGravityWarp] = useState(1.0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create master ScrollTrigger for the sequence
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          setTimelineProgress(p);

          // Update active story stage
          if (p < 0.22) {
            onActiveSectionChange?.("arrival");
            setStoryPlanetIndex(0);
          } else if (p < 0.48) {
            onActiveSectionChange?.("discovery");
            setStoryPlanetIndex(1);
          } else if (p < 0.74) {
            onActiveSectionChange?.("systems");
            setStoryPlanetIndex(2);
          } else if (p < 0.92) {
            onActiveSectionChange?.("deep-space");
            setStoryPlanetIndex(3);
          } else {
            onActiveSectionChange?.("universe");
          }
        },
      });

      // Kinetic Typography & Scene Reveal Animations with GSAP
      const titles = gsap.utils.toArray<HTMLElement>(".kinetic-title");
      titles.forEach((title) => {
        gsap.fromTo(
          title,
          { y: 60, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: title,
              start: "top 80%",
              end: "bottom 60%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });

      const cards = gsap.utils.toArray<HTMLElement>(".hud-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [onActiveSectionChange]);

  const currentPlanet = PLANETS[storyPlanetIndex % PLANETS.length];

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Pinned 3D Cinematic Viewport (Sticky Canvas Behind Text) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background Radial Light Accent */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[160px] transition-colors duration-1000"
          style={{ background: currentPlanet.glowColor }}
        />

        {/* 3D Canvas directed by scroll progress */}
        <div className="absolute inset-0">
          <CinematicStoryCanvas
            progress={timelineProgress}
            currentPlanetIndex={storyPlanetIndex}
          />
        </div>

        {/* HUD Overlay — Active Telemetry Bar */}
        <div className="pointer-events-none absolute bottom-8 left-6 right-6 z-20 mx-auto flex max-w-7xl items-center justify-between border-t border-white/[0.08] pt-4 md:left-12 md:right-12">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-ice/80">
            <Radio className="h-3.5 w-3.5 animate-pulse text-ice" />
            <span>Telemetry Link: {currentPlanet.name}</span>
          </div>

          {/* Interactive Gravitational Warp Scrub-able control */}
          <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-1.5 backdrop-blur-md">
            <Sliders className="h-3.5 w-3.5 text-ice" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-mist">
              Warp {gravityWarp.toFixed(1)}x
            </span>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={gravityWarp}
              onChange={(e) => setGravityWarp(parseFloat(e.target.value))}
              aria-label="Gravitational Warp Multiplier"
              className="h-1 w-20 cursor-pointer accent-ice"
            />
          </div>
        </div>
      </div>

      {/* Narrative Scroll Chapters Overlaying the 3D Canvas */}
      <div className="relative z-10 -mt-[100vh]">
        {/* CHAPTER 1: ARRIVAL */}
        <section
          id="arrival"
          className="flex min-h-screen items-center px-6 md:px-12"
        >
          <div className="mx-auto max-w-7xl w-full">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-ice/30 bg-ice/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-ice backdrop-blur-md">
                <Sparkles className="h-3 w-3 text-ice animate-pulse" />
                <span>Phase I // Arrival</span>
              </div>
              <h1 className="kinetic-title mt-6 font-display text-5xl font-light leading-[0.98] text-white sm:text-7xl lg:text-8xl">
                Enter the
                <br />
                <span className="italic text-violet-glow">Unknown Horizon.</span>
              </h1>
              <p className="mt-8 max-w-lg text-base leading-relaxed text-dim md:text-lg">
                Beneath the quiet glow of cosmic dust, ancient celestial engines
                spin in silent resonance. Scroll down to chart the outer planetary
                rim.
              </p>
              <div className="mt-10 flex items-center gap-4">
                <MagneticButton
                  href="#discovery"
                  className="group inline-flex items-center gap-3 rounded-full border border-ice/40 bg-white/[0.04] px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-white backdrop-blur-md transition-all duration-300 hover:border-ice hover:bg-ice/20 hover:shadow-[0_0_30px_rgba(94,231,255,0.25)]"
                >
                  <span>Begin Descent</span>
                  <ArrowDown className="h-3.5 w-3.5 text-ice transition-transform group-hover:translate-y-1" />
                </MagneticButton>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 2: DISCOVERY */}
        <section
          id="discovery"
          className="flex min-h-screen items-center px-6 md:px-12"
        >
          <div className="mx-auto max-w-7xl w-full">
            <div className="ml-auto max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-glow/30 bg-violet-glow/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-violet-glow backdrop-blur-md">
                <Orbit className="h-3 w-3 text-violet-glow animate-spin" />
                <span>Phase II // Discovery</span>
              </div>
              <h2 className="kinetic-title mt-6 font-display text-4xl font-light text-white sm:text-6xl">
                Planetary Orbits
                <br />
                <span className="italic text-ice">&amp; Stellar Mechanics.</span>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-dim">
                Every world maintains a distinct gravitational signature and
                atmospheric shell. Orbiting probes transmit continuous spectral
                readouts across the void.
              </p>

              {/* Live Metric Cards */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="hud-card rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
                  <div className="font-mono text-xs uppercase text-dim">Atmosphere</div>
                  <div className="mt-1 font-mono text-lg font-light text-white">
                    {PLANETS[1].atmosphereComposition.split(",")[0]}
                  </div>
                </div>
                <div className="hud-card rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
                  <div className="font-mono text-xs uppercase text-dim">Surface Heat</div>
                  <div className="mt-1 font-mono text-lg font-light text-white">
                    {PLANETS[1].surfaceTemp}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 3: PLANETARY SYSTEMS */}
        <section
          id="systems"
          className="flex min-h-screen items-center px-6 md:px-12"
        >
          <div className="mx-auto max-w-7xl w-full">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-ice/30 bg-ice/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-ice backdrop-blur-md">
                <Compass className="h-3 w-3 text-ice" />
                <span>Phase III // Planetary Systems</span>
              </div>
              <h2 className="kinetic-title mt-6 font-display text-4xl font-light text-white sm:text-6xl">
                Echoes of
                <br />
                <span className="italic text-violet-glow">Oceanic Sanctuaries.</span>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-dim">
                Deep oceanic rifts pulse beneath azure cloud decks. Moons lock in
                resonant orbits, stirring bioluminescent tidal rhythms visible
                from high atmosphere.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="hud-card flex items-center gap-3 rounded-full border border-white/10 bg-black/40 px-5 py-2.5 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-mono text-xs uppercase tracking-wider text-mist">
                    Class III Pelagic Super-Earth
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 4: DEEP SPACE */}
        <section
          id="deep-space"
          className="flex min-h-screen items-center px-6 md:px-12"
        >
          <div className="mx-auto max-w-7xl w-full">
            <div className="ml-auto max-w-2xl text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-ice/30 bg-ice/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-ice backdrop-blur-md">
                <span>Phase IV // Deep Space</span>
              </div>
              <h2 className="kinetic-title mt-6 font-display text-4xl font-light text-white sm:text-6xl">
                The Frozen Perimeter
                <br />
                <span className="italic text-violet-glow">&amp; Beyond.</span>
              </h2>
              <p className="mt-6 ml-auto max-w-lg text-base leading-relaxed text-dim">
                Nitrogen glaciers reflect ancient interstellar nebulae. Beyond this
                boundary lies the uncharted expanse of Sector Epsilon-9.
              </p>
            </div>
          </div>
        </section>

        {/* CHAPTER 5: FINAL EXPLORATION CTA */}
        <section
          id="final-cta"
          className="flex min-h-[70vh] items-center justify-center px-6 py-24 text-center md:px-12"
        >
          <div className="mx-auto max-w-3xl flex flex-col items-center">
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-ice">
              Phase V // Active Navigation
            </span>
            <h2 className="kinetic-title mt-4 font-display text-5xl font-light text-white sm:text-6xl md:text-7xl">
              Take the Helm.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-dim">
              Explore every coordinate directly with full manual orbit controls,
              detailed scientific dossiers, and planetary telemetry.
            </p>
            <div className="mt-10">
              <MagneticButton
                href="#universe"
                className="group inline-flex items-center gap-4 rounded-full border border-ice bg-ice/15 px-9 py-4 text-xs uppercase tracking-[0.3em] text-white shadow-[0_0_40px_rgba(94,231,255,0.3)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-ice/25"
              >
                <span>Enter Observatory</span>
                <ChevronRight className="h-4 w-4 text-ice transition-transform group-hover:translate-x-1" />
              </MagneticButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
