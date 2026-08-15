"use client";

import { useEffect, useRef, useState } from "react";

const MUTED_KEY = "etfc-music-muted";
const VOLUME_KEY = "etfc-music-volume";
const DEFAULT_VOLUME = 0.45;
const VOLUME_STEP = 0.1;

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

function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let storedMuted = false;
    let storedVolume = DEFAULT_VOLUME;
    try {
      storedMuted = localStorage.getItem(MUTED_KEY) === "1";
      const rawVolume = Number(localStorage.getItem(VOLUME_KEY));
      if (Number.isFinite(rawVolume) && rawVolume >= 0 && rawVolume <= 1) {
        storedVolume = rawVolume;
      }
    } catch {
      // storage unavailable — default to trying to play
    }
    setMuted(storedMuted);
    setVolume(storedVolume);

    audio.volume = storedVolume;
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

  const changeVolume = (delta: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const next = Math.min(1, Math.max(0, Math.round((volume + delta) * 100) / 100));
    setVolume(next);
    audio.volume = next;
    try {
      localStorage.setItem(VOLUME_KEY, String(next));
    } catch {
      // storage unavailable, level just won't persist across visits
    }
  };

  return (
    <>
      {/* preload="auto" — the track needs to actually be buffered by the
          time play() fires on mount, or "starts as the site loads" just
          becomes "starts once it's finally fetched enough to play." Trades
          a bit of initial bandwidth for that. */}
      <audio ref={audioRef} src="/etfc-battlefield.mp3" loop preload="auto" className="hidden" />
      <div
        role="group"
        aria-label="Music controls"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-1 rounded-full border border-accent/30 bg-background/70 p-1 text-accent shadow-lg backdrop-blur-md"
      >
        <button
          type="button"
          onClick={() => changeVolume(-VOLUME_STEP)}
          disabled={volume <= 0}
          aria-label="Decrease music volume"
          className="flex size-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent/10 disabled:opacity-30"
        >
          <MinusIcon />
        </button>
        <button
          type="button"
          onClick={toggle}
          aria-label={muted ? "Turn music on" : "Turn music off"}
          aria-pressed={!muted}
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/30 transition-colors hover:border-accent"
        >
          {muted ? <SpeakerOffIcon /> : <SpeakerOnIcon />}
        </button>
        <button
          type="button"
          onClick={() => changeVolume(VOLUME_STEP)}
          disabled={volume >= 1}
          aria-label="Increase music volume"
          className="flex size-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-accent/10 disabled:opacity-30"
        >
          <PlusIcon />
        </button>
      </div>
    </>
  );
}

export default BackgroundMusic;
