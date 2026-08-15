"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { ConfettiBurst } from "@/components/confetti-burst";
import { ConnectorLine, FighterVoteCard } from "@/components/fight-vote-card";
import { BOXING_FIGHT_CARDS, DEFAULT_BOXING_FIGHT_CARD } from "@/lib/boxing-fight-card-content";

const BoxingRing3D = dynamic(() => import("@/components/boxing-ring-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="animate-pulse font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
        Loading ring&hellip;
      </span>
    </div>
  ),
});

// Same structure as mma-cage-scene.tsx: a real 3D ring instead of a flat
// image, the fight poster standing at its center, and contestant vote
// cards flanking it with trace lines running out from the ring's flanks.
// The ring box itself is left transparent (no bg/border) so it floats
// over the page the same way the cage does — no separate "arena card"
// background behind it.
export function BoxingRingScene() {
  const reduceMotion = Boolean(useReducedMotion());
  const [selectedId, setSelectedId] = useState(DEFAULT_BOXING_FIGHT_CARD);
  const [burstKey, setBurstKey] = useState(0);
  const [canvasKey, setCanvasKey] = useState(0);

  const selected =
    BOXING_FIGHT_CARDS.find((card) => card.id === selectedId) ?? BOXING_FIGHT_CARDS[0];

  const handleSelect = (id: string) => {
    if (id === selectedId) return;
    setSelectedId(id);
    setBurstKey((k) => k + 1);
  };

  return (
    <div className="relative flex w-full flex-col items-center pb-4">
      <div className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-accent/30 bg-black/50 p-1 backdrop-blur-sm">
        {BOXING_FIGHT_CARDS.map((card) => {
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

      {/* Ring in the middle, a trace line running straight out from each of
          its flanks to that matchup's contestant — the ring canvas itself
          stays mounted across fight switches; only the flanking lines +
          cards re-animate. */}
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
          <BoxingRing3D
            key={canvasKey}
            matchup={selected}
            reduceMotion={reduceMotion}
            onContextLost={() => setCanvasKey((k) => k + 1)}
          />

          <ConfettiBurst burstKey={burstKey} reduceMotion={reduceMotion} />

          <span className="pointer-events-none absolute bottom-[20%] left-2 z-20 flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-accent backdrop-blur-sm">
            <motion.span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-accent"
              animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            Boxing &middot; The Ring
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

export default BoxingRingScene;
