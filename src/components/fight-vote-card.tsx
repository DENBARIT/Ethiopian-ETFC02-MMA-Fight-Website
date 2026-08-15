"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { RotatingPanel } from "@/components/rotating-panel";
import type { FightCardFighter } from "@/lib/mma-fight-card-content";

// Thumbs-down — marks the side this browser did NOT pick, once a vote has
// been cast in this fight.
function LoserIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17 14V4M17 14l-4.5 6.2a1.5 1.5 0 0 1-2.7-1V15H5.8a2 2 0 0 1-1.98-2.3l1.2-8A2 2 0 0 1 7 3h10v11h-0Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// A straight trace line, perpendicular to the arena's own flank, running
// out to whichever contestant card it's paired with. `reverse` flips which
// end is the path's geometric start — the draw-in and the flowing dashes
// both animate from that start toward the other end, so passing `reverse`
// on the side where the arena sits at x=100 (not x=0) keeps the animation
// reading as "out of the arena, toward the fighter" on both flanks.
export function ConnectorLine({
  reverse = false,
  className,
}: {
  reverse?: boolean;
  className?: string;
}) {
  const x1 = reverse ? 100 : 0;
  const x2 = reverse ? 0 : 100;

  return (
    <svg
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      className={`text-accent ${className ?? ""}`}
      aria-hidden
    >
      <line
        x1={x1}
        y1={5}
        x2={x2}
        y2={5}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.2}
        vectorEffect="non-scaling-stroke"
      />
      <motion.line
        x1={x1}
        y1={5}
        x2={x2}
        y2={5}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      />
      <motion.line
        x1={x1}
        y1={5}
        x2={x2}
        y2={5}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray="3 9"
        vectorEffect="non-scaling-stroke"
        className="connector-flow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ duration: 0.3, delay: 0.65 }}
      />
      <circle cx={2} cy={5} r={1.8} fill="currentColor" />
      <circle cx={98} cy={5} r={1.8} fill="currentColor" />
    </svg>
  );
}

interface FighterVoteCardProps {
  fighter: FightCardFighter;
  /** Vote count for this side — undefined while still loading. */
  count?: number;
  /** True once this browser has voted for this side in this fight. */
  voted?: boolean;
  /** True once this browser has voted for the OTHER side — disables this
   * button without highlighting it. */
  disabled?: boolean;
  /** true = strictly ahead of the other side, false = strictly behind,
   * undefined = tied or counts not loaded yet. Colors the vote count. */
  leading?: boolean;
  onVote?: () => void;
}

export function FighterVoteCard({
  fighter,
  count,
  voted = false,
  disabled = false,
  leading,
  onVote,
}: FighterVoteCardProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [celebrate, setCelebrate] = useState(false);
  const wasVoted = useRef(false);

  useEffect(() => {
    if (voted && !wasVoted.current) {
      setCelebrate(true);
      const timer = setTimeout(() => setCelebrate(false), 2200);
      return () => clearTimeout(timer);
    }
    wasVoted.current = voted;
  }, [voted]);

  const countColor =
    leading === true ? "text-kush" : leading === false ? "text-blood" : "opacity-70";

  return (
    <div className="flex shrink-0 flex-col items-center gap-2 sm:gap-3">
      <div className="relative aspect-[3/4] w-24 overflow-hidden rounded-xl border border-accent/30 bg-black/40 shadow-lg shadow-black/50 sm:w-32 sm:rounded-2xl md:w-44 lg:w-52">
        <RotatingPanel
          images={fighter.images}
          intervalMs={3400}
          alt={fighter.name}
          sizes="(max-width: 640px) 26vw, 208px"
        />

        {disabled && (
          <span
            aria-hidden
            className="absolute right-1.5 top-1.5 z-10 flex items-center justify-center rounded-full bg-blood/90 p-1 text-limestone shadow-md"
          >
            <LoserIcon />
          </span>
        )}

        <AnimatePresence>
          {celebrate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={
                reduceMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 1, scale: [0.6, 1.08, 1], y: 0, rotate: [0, -3, 3, -1.5, 0] }
              }
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 p-2 text-center backdrop-blur-sm"
            >
              <span className="text-balance font-display text-sm uppercase leading-tight text-accent drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] sm:text-base">
                You got
                <br />
                {fighter.name}!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="max-w-[6.5rem] text-balance text-center font-display text-xs uppercase leading-tight text-foreground sm:max-w-[9rem] sm:text-sm md:max-w-[11.5rem] md:text-lg">
        {fighter.name}
      </span>
      <button
        type="button"
        onClick={onVote}
        disabled={voted || disabled}
        aria-pressed={voted}
        className={`rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] transition-colors sm:px-5 sm:py-2 sm:text-[10px] sm:tracking-[0.25em] md:text-xs ${
          voted
            ? "border-accent bg-accent text-background"
            : disabled
              ? "cursor-not-allowed border-accent/30 text-accent/40"
              : "border-accent bg-accent/10 text-accent hover:bg-accent hover:text-background"
        }`}
      >
        {voted ? "Voted" : "Vote"}
        {typeof count === "number" && <span className={countColor}> &middot; {count}</span>}
      </button>
    </div>
  );
}
