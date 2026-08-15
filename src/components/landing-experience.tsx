"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AnnouncementProvider } from "@/components/announcement-provider";
import { AnnouncementBadge } from "@/components/announcement-badge";
import { Countdown } from "@/components/countdown";
import { Nav } from "@/components/nav";
import { RotatingPanel } from "@/components/rotating-panel";
import { EVENT, PANEL_IMAGES, PANEL_INTERVALS_MS } from "@/lib/landing-content";

export function LandingExperience() {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <AnnouncementProvider>
      <main className="grid min-h-dvh grid-rows-[auto_auto] gap-4 bg-background px-4 pb-4 pt-4 sm:gap-6 sm:px-6 sm:pb-6 sm:pt-6 lg:h-dvh lg:grid-rows-[auto_1fr] lg:overflow-hidden lg:px-8 lg:pb-8 lg:pt-8">
        <Nav />
        <div className="landing-grid">
          <div data-panel="L" className="relative h-full w-full overflow-hidden bg-background">
            <RotatingPanel
              images={PANEL_IMAGES.L}
              intervalMs={PANEL_INTERVALS_MS.L}
              alt={`Fighters from the ${EVENT.name} card`}
              priority
              sizes="(max-width: 1023px) 100vw, 56vw"
            />
            <AnnouncementBadge panel="L" />
            <div className="relative z-10 flex h-full flex-col gap-6 pl-2.5 pt-2.5 pr-5 pb-5 sm:pr-8 sm:pb-8 lg:pr-12 lg:pb-12">
              <div className="card-glow self-start rounded-xl px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.35em] text-accent sm:text-xs">
                  <motion.span
                    aria-hidden
                    className="inline-block size-1.5 shrink-0 rounded-full bg-accent"
                    animate={reduceMotion ? undefined : { opacity: [1, 0.25, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  ETFC 02
                </span>
                <h1 className="mt-2 whitespace-nowrap font-display text-[8vw] uppercase leading-[0.86] text-foreground sm:text-[4.5vw] lg:text-[2.75vw]">
                  Adwa <span className="text-accent">Fight Night</span>
                </h1>
                <p className="mt-1 font-ethiopic text-sm text-foreground/90 sm:text-base">
                  {EVENT.nameAmharic}
                </p>
              </div>
              <div className="mt-auto space-y-4 pb-2">
                <p className="max-w-lg font-mono text-[11px] uppercase tracking-[0.28em] text-(--tagline) sm:text-xs">
                  Addis Ababa &middot; ETFC2 &middot; One night &middot; Eleven bouts,
                </p>
                <Countdown />
              </div>
            </div>
          </div>

          <div data-panel="R" className="relative h-full w-full overflow-hidden bg-background">
            <RotatingPanel
              images={PANEL_IMAGES.R}
              intervalMs={PANEL_INTERVALS_MS.R}
              alt={`Fighters from the ${EVENT.name} card`}
              // Below sm the L/R/Z panels stack (R and Z need a scroll), but
              // from sm up .landing-grid shows all three at once with no
              // scroll — same above-the-fold hero as L, so it gets the same
              // priority hint (only its first frame — see rotating-panel.tsx).
              priority
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 44vw"
            />
            <AnnouncementBadge panel="R" />
          </div>

          <div data-panel="Z" className="relative h-full w-full overflow-hidden bg-background">
            <RotatingPanel
              images={PANEL_IMAGES.Z}
              intervalMs={PANEL_INTERVALS_MS.Z}
              alt={`Fighters from the ${EVENT.name} card`}
              priority
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 44vw"
            />
            <AnnouncementBadge panel="Z" />
          </div>
        </div>
      </main>
    </AnnouncementProvider>
  );
}
