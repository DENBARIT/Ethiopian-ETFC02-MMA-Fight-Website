"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { EVENT } from "@/lib/landing-content";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function getRemaining(): Remaining {
  const diff = new Date(EVENT.date).getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  return {
    days: Math.floor(clamped / 86_400_000),
    hours: Math.floor((clamped % 86_400_000) / 3_600_000),
    minutes: Math.floor((clamped % 3_600_000) / 60_000),
    seconds: Math.floor((clamped % 60_000) / 1_000),
    done: diff <= 0,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

// EVENT.geezDate is "፳፯ ነሐሴ" (Geez numeral, then the Ethiopian month name).
const GEEZ_DAY = EVENT.geezDate.split(" ")[0];

const MONTH_DAY = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(
  new Date(EVENT.date),
);

function Digits({
  value,
  reduceMotion,
  className,
}: {
  value: number;
  reduceMotion: boolean;
  className: string;
}) {
  return (
    <span className={`relative block overflow-hidden leading-none ${className}`}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={reduceMotion ? { opacity: 0 } : { y: "70%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: "-70%", opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="block"
        >
          {pad(value)}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Countdown() {
  const [time, setTime] = useState<Remaining | null>(null);
  const reduceMotion = Boolean(useReducedMotion());

  useEffect(() => {
    // Runs once on mount only (client-only Date.now() read, kept out of the
    // initial render so server and first client paint stay identical).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTime(getRemaining());
    const id = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "d", value: time?.days ?? 0 },
    { label: "h", value: time?.hours ?? 0 },
    { label: "m", value: time?.minutes ?? 0 },
    { label: "s", value: time?.seconds ?? 0 },
  ];

  const srSummary = !time
    ? "Loading countdown."
    : time.done
      ? "Live now."
      : `${time.days} days, ${time.hours} hours, ${time.minutes} minutes and ${time.seconds} seconds to first bell.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      role="timer"
      aria-live="off"
      className="flex items-center gap-3"
    >
      <p className="sr-only">{srSummary}</p>

      <span
        aria-hidden
        className="flex aspect-square w-11 shrink-0 select-none items-center justify-center rounded-md font-ethiopic text-xl leading-none text-accent sm:w-12 sm:text-2xl"
      >
        {GEEZ_DAY}
      </span>

      <div aria-hidden className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-foreground/60 sm:text-xs">
          {MONTH_DAY}
        </span>

        {time?.done ? (
          <span className="font-display text-lg uppercase tracking-widest text-kush sm:text-xl">
            Live Now
          </span>
        ) : (
          <div className="flex items-baseline gap-1">
            {units.map((unit, i) => (
              <div key={unit.label} className="flex items-baseline gap-0.5">
                <Digits
                  value={unit.value}
                  reduceMotion={reduceMotion}
                  className="font-display text-lg tabular-nums text-accent sm:text-xl"
                />
                <span className="font-mono text-[9px] text-foreground/50">{unit.label}</span>
                {i < units.length - 1 && (
                  <span className="ml-0.5 text-foreground/30">:</span>
                )}
              </div>
            ))}
          </div>
        )}

        <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/40 sm:text-[10px]">
          To First Bell
        </span>
      </div>
    </motion.div>
  );
}
