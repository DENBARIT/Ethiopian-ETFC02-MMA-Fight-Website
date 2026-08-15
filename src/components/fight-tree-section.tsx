"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

// Degrees the image leans at each stop as it rocks through the scroll:
// left, upright, right, upright, left, upright, right, upright — it keeps
// rocking for as long as the image is passing through the viewport,
// instead of straightening out once and freezing.
const TILT_STOPS = [-18, 0, 18, 0, -18, 0, 18, 0];

// Geometry for the clock-dial arc: a flattened half-ellipse with tick
// marks, computed rather than hand-placed so it can be resized without
// re-deriving each coordinate by hand.
const DIAL = { cx: 300, cy: 120, rx: 270, ry: 100 };
const DIAL_LEFT = { x: DIAL.cx - DIAL.rx, y: DIAL.cy };
const DIAL_RIGHT = { x: DIAL.cx + DIAL.rx, y: DIAL.cy };
const DIAL_APEX = { x: DIAL.cx, y: DIAL.cy - DIAL.ry };
const DIAL_TICKS = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180].map((angle) => {
  const major = angle === 0 || angle === 90 || angle === 180;
  const rad = (angle * Math.PI) / 180;
  const ext = major ? 18 : 10;
  return {
    angle,
    major,
    x1: DIAL.cx + DIAL.rx * Math.cos(rad),
    y1: DIAL.cy - DIAL.ry * Math.sin(rad),
    x2: DIAL.cx + (DIAL.rx + ext) * Math.cos(rad),
    y2: DIAL.cy - (DIAL.ry + ext * (DIAL.ry / DIAL.rx)) * Math.sin(rad),
  };
});

export function FightTreeSection() {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  // Tracks the whole time the image is on screen, from first entering at
  // the bottom to fully leaving at the top — not just the initial reveal.
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(
    scrollYProgress,
    TILT_STOPS.map((_, i) => i / (TILT_STOPS.length - 1)),
    TILT_STOPS,
  );
  // Fade/scale-in still resolves quickly, early in that longer scroll range.
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.35, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.92, 1]);

  return (
    <section
      id="fight-tree"
      className="scroll-mt-24 border-t border-foreground/10 bg-background px-4 py-14 sm:px-6 sm:py-32 lg:px-8"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center sm:gap-10">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
            ETFC 02 &middot; Bracket
          </span>
          <h2 className="mt-3 font-display text-4xl uppercase leading-[0.9] text-foreground sm:text-6xl lg:text-7xl">
            Fight Tree
          </h2>
          <p className="mx-auto mt-4 max-w-md text-foreground/70">
            Boxing, Muay Thai and MMA — every bout laid out bracket by bracket.
          </p>
        </div>

        <div className="mt-8 w-full max-w-xl sm:mt-12">
          {/* Clock-dial arc over the pendulum image, marking the fight date. */}
          <svg
            viewBox="0 0 600 140"
            className="mx-auto block h-20 w-full text-accent sm:h-24 lg:h-28"
            aria-hidden
          >
            <defs>
              <linearGradient
                id="fight-tree-dial-fade"
                x1={DIAL_LEFT.x}
                y1={DIAL_LEFT.y}
                x2={DIAL_RIGHT.x}
                y2={DIAL_RIGHT.y}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                <stop offset="15%" stopColor="currentColor" stopOpacity="0.55" />
                <stop offset="85%" stopColor="currentColor" stopOpacity="0.55" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              d={`M${DIAL_LEFT.x},${DIAL_LEFT.y} A${DIAL.rx},${DIAL.ry} 0 0 1 ${DIAL_RIGHT.x},${DIAL_RIGHT.y}`}
              fill="none"
              stroke="url(#fight-tree-dial-fade)"
              strokeWidth="1.5"
            />

            {DIAL_TICKS.map((t) => (
              <line
                key={t.angle}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke="currentColor"
                strokeWidth={t.major ? 1.75 : 1.1}
                strokeLinecap="round"
                opacity={t.major ? 0.75 : 0.4}
              />
            ))}

            <circle
              cx={DIAL_APEX.x}
              cy={DIAL_APEX.y}
              r="7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.35"
            />
            <circle cx={DIAL_APEX.x} cy={DIAL_APEX.y} r="3" fill="currentColor" />

            <text
              x={DIAL.cx}
              y={DIAL_APEX.y + 46}
              textAnchor="middle"
              fill="currentColor"
              className="font-mono text-[16px] font-medium uppercase tracking-[0.3em]"
            >
              August 27
            </text>
          </svg>

          <motion.div
            ref={imageRef}
            style={
              reduceMotion
                ? undefined
                : { rotate, opacity, scale, transformOrigin: "bottom center" }
            }
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
      </div>
    </section>
  );
}
