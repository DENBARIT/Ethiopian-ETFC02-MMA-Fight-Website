"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/landing-content";

function LampIcon({ lit }: { lit: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path
        d="M12 3a6 6 0 0 0-4 10.47c.53.5.9 1.15 1 1.86v.17h6v-.17c.1-.71.47-1.36 1-1.86A6 6 0 0 0 12 3Z"
        fill={lit ? "currentColor" : "none"}
        fillOpacity={lit ? 0.25 : 0}
      />
    </svg>
  );
}

export function Nav() {
  const [mounted, setMounted] = useState(false);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Runs once on mount only, to read the theme class the blocking init
    // script already applied without mismatching the server-rendered markup.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setIsLight(document.documentElement.classList.contains("theme-light"));
  }, []);

  function toggleTheme() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("theme-light", next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {
      // storage unavailable, theme just won't persist across visits
    }
  }

  const lit = mounted && isLight;

  return (
    <nav className="mx-auto flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full border border-foreground/15 bg-background/60 px-2 py-2 backdrop-blur-md sm:gap-2 sm:px-3">
      <span className="rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-accent sm:text-xs">
        ETFC 02
      </span>
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group relative rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-foreground sm:text-xs"
        >
          {link.label}
          <span className="absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
        </Link>
      ))}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={lit ? "Switch to dark mode" : "Switch to light mode"}
        aria-pressed={lit}
        className={`ml-1 flex size-8 shrink-0 items-center justify-center rounded-full border border-foreground/15 transition-colors ${
          lit ? "text-kush" : "text-accent"
        }`}
      >
        <LampIcon lit={lit} />
      </button>
    </nav>
  );
}
