"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { BOXING_FIGHT_CARDS } from "@/lib/boxing-fight-card-content";
import { EVENT } from "@/lib/landing-content";
import { MMA_FIGHT_CARDS } from "@/lib/mma-fight-card-content";
import { MUAYTHAI_FIGHT_CARDS } from "@/lib/muaythai-fight-card-content";

// Derived from the real fight-card data (not hand-typed) so this can never
// drift out of sync the way the hero's hardcoded bout counts once did.
const STATS = [
  { label: "Boxing", value: BOXING_FIGHT_CARDS.length },
  { label: "Muay Thai", value: MUAYTHAI_FIGHT_CARDS.length },
  { label: "MMA", value: MMA_FIGHT_CARDS.length },
];
const TOTAL_MATCHES = STATS.reduce((sum, s) => sum + s.value, 0);

const MONTH_DAY = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(
  new Date(EVENT.date),
);

// Brand palette (see globals.css) — same colors as confetti-burst.tsx, just
// a full-screen fall instead of a small point burst.
const CONFETTI_COLORS = ["#e4b33c", "#0b7a3f", "#b4232a", "#e6e2d8"];
const CONFETTI_COUNT = 70;
const SESSION_KEY = "etfc-intro-seen";
const HOLD_MS = 3000;
const REDUCED_HOLD_MS = 1500;
const EXIT_S = 0.7;

interface ConfettiPiece {
  id: number;
  leftPct: number;
  delay: number;
  duration: number;
  rotate: number;
  drift: number;
  color: string;
  width: number;
  height: number;
}

function rollConfetti(): ConfettiPiece[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    leftPct: Math.random() * 100,
    delay: Math.random() * 0.7,
    duration: 2.4 + Math.random() * 1.6,
    rotate: (Math.random() - 0.5) * 720,
    drift: (Math.random() - 0.5) * 140,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    width: 6 + Math.random() * 6,
    height: 10 + Math.random() * 8,
  }));
}

/** Full-screen splash shown once per browser session, right as the site
 * loads. The page underneath renders normally the whole time — this just
 * paints on top of it client-side and clears itself. */
export function IntroOverlay() {
  const reduceMotion = Boolean(useReducedMotion());
  const [visible, setVisible] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  // Decide once per session whether to show it at all. Deliberately doesn't
  // also own the hide-timer below — under React Strict Mode this effect
  // runs twice on mount (mount, cleanup, mount again), and if the timer
  // were started here, the first pass's cleanup would cancel it while the
  // second pass no-ops (sessionStorage already says "seen"), leaving
  // `visible` stuck true forever with nothing left to time it out.
  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem(SESSION_KEY) === "1";
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // storage unavailable (private mode, etc.) — just show it once per tab
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!alreadySeen) setVisible(true);
  }, []);

  // Runs as a genuine reaction to `visible` flipping true (a real state
  // update after mount, not part of Strict Mode's synthetic double-invoke),
  // so its timer reliably survives to fire.
  useEffect(() => {
    if (!visible) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!reduceMotion) setConfetti(rollConfetti());
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => setVisible(false), reduceMotion ? REDUCED_HOLD_MS : HOLD_MS);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [visible, reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: EXIT_S, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 55% at 50% 38%, color-mix(in oklab, var(--accent) 24%, transparent), transparent 70%)",
            }}
          />

          {confetti.map((piece) => (
            <motion.span
              key={piece.id}
              aria-hidden
              initial={{ opacity: 0, y: "-10vh", x: 0, rotate: 0 }}
              animate={{ opacity: [0, 1, 1, 0], y: "110vh", x: piece.drift, rotate: piece.rotate }}
              transition={{ duration: piece.duration, delay: piece.delay, ease: "easeIn" }}
              className="pointer-events-none absolute top-0 rounded-[2px]"
              style={{
                left: `${piece.leftPct}%`,
                width: piece.width,
                height: piece.height,
                backgroundColor: piece.color,
              }}
            />
          ))}

          <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center sm:gap-4">
            <motion.span
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
              className="font-mono text-xs uppercase tracking-[0.4em] text-accent sm:text-sm"
            >
              ETFC 02
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl uppercase leading-[0.9] text-foreground drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] sm:text-7xl md:text-8xl"
            >
              Adwa <span className="text-accent">Fight Night</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="mt-1 font-display text-2xl uppercase text-accent sm:text-4xl"
            >
              {TOTAL_MATCHES} Matches
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-1 flex flex-wrap items-center justify-center gap-2"
            >
              {STATS.map((stat) => (
                <span
                  key={stat.label}
                  className="rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent sm:text-xs"
                >
                  {stat.value} {stat.label}
                </span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.15, duration: 0.5 }}
              className="mt-2 font-mono text-xs uppercase tracking-[0.35em] text-foreground/60 sm:text-sm"
            >
              {MONTH_DAY}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default IntroOverlay;
