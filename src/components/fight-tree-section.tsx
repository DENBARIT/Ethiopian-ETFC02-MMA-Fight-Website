"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// How far the image leans (in degrees) the moment it enters the viewport.
// It straightens out to 0deg — fully upright — as the scroll carries it
// from the bottom of the screen up to dead center.
const START_TILT_DEG = -18;

export function FightTreeSection() {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "center center"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [START_TILT_DEG, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.35, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);

  return (
    <section
      id="fight-tree"
      className="scroll-mt-24 border-t border-foreground/10 bg-background px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
            ETFC 02 &middot; Bracket
          </span>
          <h2 className="mt-3 font-display text-5xl uppercase leading-[0.9] text-foreground sm:text-6xl lg:text-7xl">
            Fight Tree
          </h2>
          <p className="mx-auto mt-4 max-w-md text-foreground/70">
            Boxing, Muay Thai and MMA — every bout laid out bracket by bracket.
          </p>
        </div>

        <motion.div
          ref={imageRef}
          style={
            reduceMotion
              ? undefined
              : { rotate, opacity, scale, transformOrigin: "bottom center" }
          }
          className="w-full max-w-xl"
        >
          <Image
            src="/fight-tree/main-fight-tree.png"
            alt="Adwa Fight Night full fight tree bracket — boxing, Muay Thai and MMA bouts"
            width={685}
            height={866}
            sizes="(max-width: 640px) 90vw, 640px"
            className="h-auto w-full rounded-2xl shadow-2xl shadow-black/40"
          />
        </motion.div>
      </div>
    </section>
  );
}
