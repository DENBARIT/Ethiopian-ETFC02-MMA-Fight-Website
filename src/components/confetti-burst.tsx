"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Brand palette (see globals.css) rather than a generic rainbow, so the
// burst reads as on-brand confetti instead of a stock effect.
const COLORS = ["#e4b33c", "#0b7a3f", "#b4232a", "#e6e2d8"];
const PARTICLE_COUNT = 26;

interface Particle {
  id: number;
  xEnd: number;
  yEnd: number;
  rotateEnd: number;
  delay: number;
  duration: number;
  color: string;
  width: number;
  height: number;
}

function rollParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    xEnd: (Math.random() - 0.5) * 260,
    yEnd: 130 + Math.random() * 90,
    rotateEnd: (Math.random() - 0.5) * 540,
    delay: Math.random() * 0.12,
    duration: 1 + Math.random() * 0.4,
    color: COLORS[i % COLORS.length],
    width: 5 + Math.random() * 4,
    height: 8 + Math.random() * 5,
  }));
}

interface ConfettiBurstProps {
  /** Increment to replay the burst; 0 renders nothing. */
  burstKey: number;
  reduceMotion: boolean;
}

export function ConfettiBurst({ burstKey, reduceMotion }: ConfettiBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Randomness has to be rolled after mount (client-only), not during
    // render, so each replay is kept out of the render body itself.
    if (burstKey === 0 || reduceMotion) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(rollParticles());
  }, [burstKey, reduceMotion]);

  if (burstKey === 0 || reduceMotion || particles.length === 0) return null;

  return (
    <div
      key={burstKey}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-10 z-30 flex justify-center overflow-visible"
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 0, x: p.xEnd, y: p.yEnd, rotate: p.rotateEnd }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
          className="absolute rounded-[2px]"
          style={{ width: p.width, height: p.height, backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
