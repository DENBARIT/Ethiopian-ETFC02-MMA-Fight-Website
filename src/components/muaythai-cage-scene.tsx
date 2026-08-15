"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { CommentsSection } from "@/components/comments-section";
import { ConfettiBurst } from "@/components/confetti-burst";
import { ConnectorLine, FighterVoteCard } from "@/components/fight-vote-card";
import {
  DEFAULT_MUAYTHAI_FIGHT_CARD,
  MUAYTHAI_FIGHT_CARDS,
} from "@/lib/muaythai-fight-card-content";
import { useFightVotes } from "@/lib/use-fight-votes";

const MuayThaiCage3D = dynamic(() => import("@/components/muaythai-cage-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="animate-pulse font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
        Loading cage&hellip;
      </span>
    </div>
  ),
});

// Same structure as mma-cage-scene.tsx and boxing-ring-scene.tsx: a real 3D
// octagon cage (see muaythai-cage-3d.tsx) instead of a flat image, the fight
// poster standing at its center, and contestant vote cards flanking it with
// trace lines running out from the cage's flanks. The cage box itself is
// left transparent (no bg/border) so it floats over the page.
export function MuayThaiCageScene() {
  const reduceMotion = Boolean(useReducedMotion());
  const [selectedId, setSelectedId] = useState(DEFAULT_MUAYTHAI_FIGHT_CARD);
  const [burstKey, setBurstKey] = useState(0);
  const [canvasKey, setCanvasKey] = useState(0);

  const selected =
    MUAYTHAI_FIGHT_CARDS.find((card) => card.id === selectedId) ?? MUAYTHAI_FIGHT_CARDS[0];
  const { counts, votedSide, vote } = useFightVotes(selected.id);
  const tied = !counts || counts.left === counts.right;

  const handleSelect = (id: string) => {
    if (id === selectedId) return;
    setSelectedId(id);
    setBurstKey((k) => k + 1);
  };

  return (
    <div className="relative flex w-full flex-col items-center pb-4">
      <div className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-accent/30 bg-black/50 p-1 backdrop-blur-sm">
        {MUAYTHAI_FIGHT_CARDS.map((card) => {
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
      <div className="fight-scene-grid mt-1 sm:mt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            data-area="left"
            initial={{ opacity: 0, x: reduceMotion ? 0 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : -16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex shrink-0 items-center gap-1 sm:gap-3 md:gap-4"
          >
            <FighterVoteCard
              fighter={selected.left}
              count={counts?.left}
              voted={votedSide === "left"}
              disabled={votedSide === "right"}
              leading={tied ? undefined : (counts?.left ?? 0) > (counts?.right ?? 0)}
              onVote={() => vote("left")}
            />
            <ConnectorLine reverse className="hidden h-2 sm:block sm:w-10 md:w-16 lg:w-20" />
          </motion.div>
        </AnimatePresence>

        <div data-area="cage" className="relative h-72 w-full sm:h-96 md:h-[32rem] lg:h-[38rem] lg:max-w-2xl">
          <MuayThaiCage3D
            key={canvasKey}
            matchup={selected}
            reduceMotion={reduceMotion}
            onContextLost={() => setCanvasKey((k) => k + 1)}
          />

          {selected.caption && (
            <span className="pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full border border-accent/40 bg-background/75 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent backdrop-blur-sm sm:text-xs">
              {selected.caption}
            </span>
          )}

          <ConfettiBurst burstKey={burstKey} reduceMotion={reduceMotion} />

          {/* bottom-[20%] rather than bottom-2: the camera framing (see
              muaythai-cage-3d.tsx) leaves a deliberate clip-safety margin
              below the cage floor, so pinning to the box's true bottom edge
              leaves the label floating in that empty gap below the cage. */}
          <span className="pointer-events-none absolute bottom-[20%] left-2 z-20 flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-accent backdrop-blur-sm">
            <motion.span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-accent"
              animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            Muay Thai &middot; The Cage
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            data-area="right"
            initial={{ opacity: 0, x: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : 16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex shrink-0 items-center gap-1 sm:gap-3 md:gap-4"
          >
            <ConnectorLine className="hidden h-2 sm:block sm:w-10 md:w-16 lg:w-20" />
            <FighterVoteCard
              fighter={selected.right}
              count={counts?.right}
              voted={votedSide === "right"}
              disabled={votedSide === "left"}
              leading={tied ? undefined : (counts?.right ?? 0) > (counts?.left ?? 0)}
              onVote={() => vote("right")}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <CommentsSection fightId={selected.id} />
    </div>
  );
}

export default MuayThaiCageScene;
