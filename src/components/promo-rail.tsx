"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { PromoCard } from "@/lib/promo-content";

const CARD_MS = 7000;

interface PromoRailProps {
  cards: PromoCard[];
  // Offsets the first cycle so the left and right rails don't beat in lockstep.
  startDelayMs?: number;
}

export function PromoRail({ cards, startDelayMs = 0 }: PromoRailProps) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const reduceMotion = useReducedMotion();
  const card = cards[index];

  useEffect(() => {
    const start = setTimeout(() => setStarted(true), startDelayMs);
    return () => clearTimeout(start);
  }, [startDelayMs]);

  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => {
      setIndex((current) => (current + 1) % cards.length);
    }, CARD_MS);
    return () => clearTimeout(t);
  }, [started, index, cards.length]);

  if (!started) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none flex w-28 flex-col items-center overflow-hidden sm:w-32 2xl:w-36"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full overflow-hidden rounded-xl border border-foreground/15 bg-background shadow-2xl shadow-black/40"
        >
          <Image
            src={card.src}
            alt={card.alt}
            width={card.width}
            height={card.height}
            sizes="(min-width: 1536px) 144px, 112px"
            className="h-auto w-full"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
