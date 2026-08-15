"use client";

import { motion } from "framer-motion";
import { RotatingPanel } from "@/components/rotating-panel";
import type { FightCardFighter } from "@/lib/mma-fight-card-content";

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

export function FighterVoteCard({ fighter }: { fighter: FightCardFighter }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-2 sm:gap-3">
      <div className="relative aspect-[3/4] w-24 overflow-hidden rounded-xl border border-accent/30 bg-black/40 shadow-lg shadow-black/50 sm:w-32 sm:rounded-2xl md:w-44 lg:w-52">
        <RotatingPanel
          images={fighter.images}
          intervalMs={3400}
          alt={fighter.name}
          sizes="(max-width: 640px) 26vw, 208px"
        />
      </div>
      <span className="max-w-[6.5rem] text-balance text-center font-display text-xs uppercase leading-tight text-foreground sm:max-w-[9rem] sm:text-sm md:max-w-[11.5rem] md:text-lg">
        {fighter.name}
      </span>
      <button
        type="button"
        className="rounded-full border border-accent bg-accent/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-background sm:px-5 sm:py-2 sm:text-[10px] sm:tracking-[0.25em] md:text-xs"
      >
        Vote
      </button>
    </div>
  );
}
