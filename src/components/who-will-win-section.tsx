"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BoxingRingScene } from "@/components/boxing-ring-scene";
import { MmaCageScene } from "@/components/mma-cage-scene";
import { MuayThaiCageScene } from "@/components/muaythai-cage-scene";
import { PromoRail } from "@/components/promo-rail";
import { PROMO_CARDS_LEFT, PROMO_CARDS_RIGHT } from "@/lib/promo-content";
import { DEFAULT_DISCIPLINE, DISCIPLINES, type Discipline } from "@/lib/who-will-win-content";

export function WhoWillWinSection() {
  const [discipline, setDiscipline] = useState<Discipline>(DEFAULT_DISCIPLINE);
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <section
      id="who-will-win"
      className="scroll-mt-24 border-t border-foreground/10 bg-background px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] lg:items-stretch lg:gap-6">
        {/* The outer column is as tall as the whole section (grid row
            stretch); the inner div is what actually sticks, so it stays
            pinned near the top of the viewport only while this section is
            scrolling by, then releases once the section ends. */}
        <div className="hidden lg:block">
          <div className="lg:sticky lg:top-24">
            <PromoRail cards={PROMO_CARDS_LEFT} />
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
          <div className="flex flex-col items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
              ETFC 02 &middot; Predictions
            </span>
            <motion.div
              animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-xl sm:max-w-2xl"
            >
              <h2>
                <Image
                  src="/who-will-win/who-will-win.png"
                  alt="Who Will Win?"
                  width={1619}
                  height={588}
                  priority
                  sizes="(min-width: 640px) 42rem, 90vw"
                  className="h-auto w-full"
                />
              </h2>
            </motion.div>
          </div>

          <p className="mt-10 max-w-md font-marker text-2xl text-accent sm:mt-14 sm:text-3xl">
            Who Takes the Crown?
          </p>

          <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-foreground/15 p-1">
            {DISCIPLINES.map((option) => {
              const active = option.id === discipline;
              // Every discipline has a lower selector to connect down to —
              // the connector traces from this specific button's own
              // rendered position (via the relative wrapper), not a
              // guessed offset.
              const showConnector = active;
              return (
                <div key={option.id} className="relative">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setDiscipline(option.id)}
                    className={`rounded-full px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
                      active ? "bg-accent text-background" : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {option.label}
                  </button>
                  {showConnector && (
                    <div
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-full flex -translate-x-1/2 flex-col items-center"
                    >
                      <span className="h-9 w-px bg-gradient-to-b from-accent/70 to-accent/15" />
                      <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={discipline}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative mt-10 w-full max-w-6xl"
            >
              {discipline === "mma" ? (
                <MmaCageScene />
              ) : discipline === "boxing" ? (
                <BoxingRingScene />
              ) : (
                <MuayThaiCageScene />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden lg:block lg:justify-self-end">
          <div className="lg:sticky lg:top-24">
            <PromoRail cards={PROMO_CARDS_RIGHT} startDelayMs={1400} />
          </div>
        </div>
      </div>
    </section>
  );
}
