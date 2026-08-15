"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

interface RotatingPanelProps {
  images: string[];
  intervalMs: number;
  alt: string;
  priority?: boolean;
  sizes?: string;
}

// Scale never comes down to 1: at 1 object-cover shows the least-cropped
// view of the source image, which is exactly where edge artifacts (logo
// corners, cut-off text) become visible. Staying above ZOOM_FLOOR keeps
// those edges permanently cropped out.
const ZOOM_DEEP = 1.14;
const ZOOM_FLOOR = 1.05;
const CROSSFADE_S = 1.6;

export function RotatingPanel({
  images,
  intervalMs,
  alt,
  priority = false,
  sizes = "(max-width: 900px) 100vw, 50vw",
}: RotatingPanelProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [images.length, intervalMs]);

  // The zoom-out deliberately outlasts the display interval so a layer is
  // still mid-zoom (never fully settled at ZOOM_FLOOR) when the next one
  // starts crossfading in on top of it — the two zooms overlap instead of
  // one finishing before the other begins.
  const zoomDurationS = intervalMs / 1000 + CROSSFADE_S;

  return (
    <div className="absolute inset-0 overflow-hidden bg-background">
      <AnimatePresence>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: reduceMotion ? ZOOM_FLOOR : ZOOM_DEEP }}
          animate={{ opacity: 1, scale: ZOOM_FLOOR }}
          exit={{ opacity: 0 }}
          transition={
            reduceMotion
              ? { duration: 0.6, ease: "easeInOut" }
              : {
                  opacity: { duration: CROSSFADE_S, ease: "easeInOut" },
                  scale: { duration: zoomDurationS, ease: "linear" },
                }
          }
        >
          <Image
            src={images[index]}
            alt={alt}
            fill
            // Only the very first frame is a real above-the-fold candidate —
            // later rotations mount minutes into the visit and have no
            // business being eagerly preloaded just because the panel
            // itself started out priority.
            priority={priority && index === 0}
            sizes={sizes}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-background/5 to-transparent" />
    </div>
  );
}
