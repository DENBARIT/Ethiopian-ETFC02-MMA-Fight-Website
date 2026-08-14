"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAnnouncement } from "@/components/announcement-provider";
import type { PanelId } from "@/lib/landing-content";

export function AnnouncementBadge({ panel }: { panel: PanelId }) {
  const announcement = useAnnouncement(panel);
  const reduceMotion = useReducedMotion();
  const show = Boolean(announcement?.visible);

  // Panel L also shows the countdown timer bottom-left, so its promo badge
  // sits bottom-right instead to avoid covering it.
  const position =
    panel === "L"
      ? "bottom-4 right-4 sm:bottom-6 sm:right-6"
      : "bottom-4 left-4 sm:bottom-6 sm:left-6";

  return (
    <div className={`pointer-events-none absolute z-20 ${position}`}>
      <AnimatePresence mode="wait">
        {show && announcement && (
          <motion.div
            key={announcement.id}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="card-glow rounded-sm px-3 py-2 backdrop-blur-sm"
          >
            <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
              {announcement.kicker}
            </span>
            <span className="font-display text-base tracking-normal text-foreground sm:text-lg">
              {announcement.value}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
