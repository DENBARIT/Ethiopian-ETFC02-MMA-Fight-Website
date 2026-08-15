"use client";

import { useEffect, useRef, useState } from "react";

const MUTED_KEY = "etfc-music-muted";
const VOLUME = 0.45;

function SpeakerOnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 9v6h4l5 4V5L8 9H4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M16.3 8.7a5 5 0 0 1 0 6.6M19 6a8.5 8.5 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 9v6h4l5 4V5L8 9H4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path d="m16.5 9.5 5 5M21.5 9.5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Loops a background track from the moment the site loads. Browsers block
 * unmuted autoplay without a prior user gesture, so this tries to play
 * immediately and, if blocked, falls back to starting on the very first
 * click/tap/keypress anywhere on the page — same practical effect as
 * "starts as the site loads" within what autoplay policy actually allows.
 * The toggle button is the one explicit way to turn it off, and that choice
 * is remembered for next time. */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let storedMuted = false;
    try {
      storedMuted = localStorage.getItem(MUTED_KEY) === "1";
    } catch {
      // storage unavailable — default to trying to play
    }
    setMuted(storedMuted);

    audio.volume = VOLUME;
    if (storedMuted) return;

    const tryPlay = () => audio.play().catch(() => {});
    tryPlay();

    const onFirstInteraction = () => {
      if (!audio.paused) return;
      tryPlay();
    };
    window.addEventListener("pointerdown", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);

    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const next = !muted;
    setMuted(next);
    try {
      localStorage.setItem(MUTED_KEY, next ? "1" : "0");
    } catch {
      // storage unavailable, preference just won't persist across visits
    }

    if (next) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  };

  return (
    <>
      {/* preload="none" — a 3.4MB track shouldn't compete with images/CSS/JS
          for bandwidth during initial load; the browser starts buffering it
          the moment play() is actually called, whether that's the autoplay
          attempt or the first user interaction. */}
      <audio ref={audioRef} src="/etfc-battlefield.mp3" loop preload="none" className="hidden" />
      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? "Turn music on" : "Turn music off"}
        aria-pressed={!muted}
        className="fixed bottom-4 right-4 z-40 flex size-10 items-center justify-center rounded-full border border-accent/30 bg-background/70 text-accent shadow-lg backdrop-blur-md transition-colors hover:border-accent"
      >
        {muted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
      </button>
    </>
  );
}

export default BackgroundMusic;
