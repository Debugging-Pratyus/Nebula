"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Hero() {
  const reduce = useReducedMotion();

  const reveal = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.1, delay, ease: "easeOut" as const },
        };

  return (
    <section className="relative flex min-h-screen items-center px-6 pb-16 pt-28 md:px-12">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
        <div className="order-last md:order-first">
          <motion.p
            {...reveal(0.2)}
            className="mb-6 text-xs uppercase tracking-[0.4em] text-ice/80"
          >
            An interactive universe
          </motion.p>

          <motion.h1
            {...reveal(0.45)}
            className="font-display text-6xl font-light leading-[0.95] text-white sm:text-7xl lg:text-8xl"
          >
            Drift between
            <br />
            <span className="italic text-violet-glow">worlds.</span>
          </motion.h1>

          <motion.p
            {...reveal(0.8)}
            className="mt-8 max-w-md text-base leading-relaxed text-dim md:text-lg"
          >
            NEBULA is a real-time 3D journey through a fictional galaxy. Pick a
            world, fly to it, and discover what lives there.
          </motion.p>

          <motion.div {...reveal(1.1)} className="mt-12">
            <a
              href="#universe"
              className="group inline-flex items-center gap-5 rounded-full border border-ice/30 bg-white/[0.03] px-8 py-4 text-xs uppercase tracking-[0.3em] text-mist outline-none backdrop-blur-sm transition-all duration-500 hover:border-ice/70 hover:text-white hover:shadow-[0_0_40px_rgba(94,231,255,0.18)] focus-visible:ring-2 focus-visible:ring-ice/70"
            >
              Enter the Universe
              <span className="h-px w-8 bg-ice/60 transition-all duration-500 group-hover:w-12" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.1, ease: "easeOut" }}
          className="order-first mx-auto md:order-last"
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -14, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-square w-[min(68vw,320px)] md:w-[min(38vw,520px)]"
          >
            <div className="planet absolute inset-0" />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[32%] w-[150%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] rounded-[50%] border border-ice/25"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

