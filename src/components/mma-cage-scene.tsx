"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ConfettiBurst } from "@/components/confetti-burst";
import { RotatingPanel } from "@/components/rotating-panel";
import {
  DEFAULT_MMA_FIGHT_CARD,
  MMA_FIGHT_CARDS,
  type FightCardFighter,
} from "@/lib/mma-fight-card-content";

// A straight trace line, perpendicular to the cage's own flank, running
// out to whichever contestant card it's paired with. `reverse` flips which
// end is the path's geometric start — the draw-in and the flowing dashes
// both animate from that start toward the other end, so passing `reverse`
// on the side where the cage sits at x=100 (not x=0) keeps the animation
// reading as "out of the cage, toward the fighter" on both flanks.
function ConnectorLine({ reverse = false, className }: { reverse?: boolean; className?: string }) {
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

function FighterVoteCard({ fighter }: { fighter: FightCardFighter }) {
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

const MmaOctagonCage = dynamic(() => import("@/components/mma-octagon-cage"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="animate-pulse font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
        Loading cage&hellip;
      </span>
    </div>
  ),
});

// MMA renders a real 3D octagon (see mma-octagon-cage.tsx) instead of the
// procedural boxing/Muay Thai rings. The fight card is a textured plane
// standing at the center of the cage floor, in the same scene and camera
// as the fence — so both share one true perspective/vanishing point, and
// the near struts occlude the card the way an actual cageside camera would.
export function MmaCageScene() {
  const reduceMotion = Boolean(useReducedMotion());
  const [selectedId, setSelectedId] = useState(DEFAULT_MMA_FIGHT_CARD);
  const [burstKey, setBurstKey] = useState(0);
  const [canvasKey, setCanvasKey] = useState(0);

  const selected = MMA_FIGHT_CARDS.find((card) => card.id === selectedId) ?? MMA_FIGHT_CARDS[0];

  const handleSelect = (id: string) => {
    if (id === selectedId) return;
    setSelectedId(id);
    setBurstKey((k) => k + 1);
  };

  return (
    <div className="relative flex w-full flex-col items-center pb-4">
      <div className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-accent/30 bg-black/50 p-1 backdrop-blur-sm">
        {MMA_FIGHT_CARDS.map((card) => {
          const active = card.id === selectedId;
          return (
            <div key={card.id} className="relative">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => handleSelect(card.id)}
                className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] transition-colors sm:px-3 sm:text-[10px] ${
                  active ? "bg-accent text-background" : "text-limestone/70 hover:text-limestone"
                }`}
              >
                {card.tab}
              </button>
              {active && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-full flex -translate-x-1/2 flex-col items-center"
                >
                  <span className="h-7 w-px bg-gradient-to-b from-accent/80 to-accent/20 sm:h-8" />
                  <span className="h-1.5 w-1.5 rounded-full bg-accent/80" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.span
          key={selected.id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="mt-8 max-w-[90%] text-balance text-center font-display text-2xl uppercase leading-[0.95] tracking-wide text-accent drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] sm:mt-9 sm:text-3xl md:text-4xl"
        >
          {selected.fighters}
        </motion.span>
      </AnimatePresence>

      {/* Cage in the middle, a trace line running straight out from each of
          its flanks to that matchup's contestant — the cage canvas itself
          stays mounted across fight switches (its own card texture
          crossfades internally); only the flanking lines + cards re-animate. */}
      <div className="mt-1 flex w-full max-w-6xl items-center justify-center gap-1 sm:mt-2 sm:gap-3 md:gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: reduceMotion ? 0 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : -16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex shrink-0 items-center gap-1 sm:gap-3 md:gap-4"
          >
            <FighterVoteCard fighter={selected.left} />
            <ConnectorLine reverse className="h-2 w-5 sm:w-10 md:w-16 lg:w-20" />
          </motion.div>
        </AnimatePresence>

        <div className="relative h-72 min-w-0 flex-1 sm:h-96 md:h-[32rem] lg:h-[38rem] lg:max-w-2xl">
          <MmaOctagonCage
            key={canvasKey}
            matchup={selected}
            reduceMotion={reduceMotion}
            onContextLost={() => setCanvasKey((k) => k + 1)}
          />

          {selected.caption && (
            <span className="pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full border border-accent/40 bg-black/75 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent backdrop-blur-sm sm:text-xs">
              {selected.caption}
            </span>
          )}

          <ConfettiBurst burstKey={burstKey} reduceMotion={reduceMotion} />

          {/* bottom-[20%] rather than bottom-2: the camera framing (see
              mma-octagon-cage.tsx) leaves a deliberate clip-safety margin
              below the cage floor, so pinning to the box's true bottom edge
              leaves the label floating in that empty gap below the cage. */}
          <span className="pointer-events-none absolute bottom-[20%] left-2 z-20 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-accent backdrop-blur-sm">
            <motion.span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-accent"
              animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            MMA &middot; The Cage
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : 16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex shrink-0 items-center gap-1 sm:gap-3 md:gap-4"
          >
            <ConnectorLine className="h-2 w-5 sm:w-10 md:w-16 lg:w-20" />
            <FighterVoteCard fighter={selected.right} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
