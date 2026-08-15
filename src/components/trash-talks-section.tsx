"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  DEFAULT_TRASH_TALK_VIDEO_ID,
  TRASH_TALK_VIDEOS,
  type TrashTalkVideo,
} from "@/lib/trashtalk-content";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d="M16.6 5.82c-.9-.83-1.47-1.99-1.53-3.29h-3.14v13.66c0 1.6-1.3 2.9-2.9 2.9a2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.27 0 .53.04.78.11v-3.2a6.1 6.1 0 0 0-.78-.05A6.06 6.06 0 0 0 3 16.19a6.06 6.06 0 0 0 6.06 6.06 6.06 6.06 0 0 0 6.06-6.06V9.02a8.03 8.03 0 0 0 4.69 1.5V7.38a4.85 4.85 0 0 1-3.21-1.56Z" />
    </svg>
  );
}

function MaximizeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 3H3v6M15 21h6v-6M21 3h-6M3 21h6" />
    </svg>
  );
}

function VideoTile({
  video,
  active,
  onSelect,
}: {
  video: TrashTalkVideo;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      aria-label={`Play ${video.title}`}
      className={`group relative aspect-video w-full overflow-hidden rounded-xl border bg-foreground/5 transition-colors ${
        active ? "border-accent" : "border-foreground/15 hover:border-accent/50"
      }`}
    >
      {video.thumbnail ? (
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          sizes="(min-width: 1024px) 320px, 45vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 px-2 text-center text-foreground/60">
          <TikTokIcon />
          <span className="font-mono text-[10px] uppercase tracking-[0.15em]">
            @{video.handle}
          </span>
        </div>
      )}
      <span
        className={`absolute inset-0 flex items-center justify-center bg-black/30 text-limestone transition-opacity ${
          active ? "opacity-0" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <PlayIcon />
      </span>
      {active ? (
        <span className="absolute inset-x-0 bottom-0 bg-accent px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-background">
          Now playing
        </span>
      ) : null}
    </button>
  );
}

function TrashTalkScreen({ video }: { video: TrashTalkVideo }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isPortrait = video.platform === "tiktok";
  const platformLabel = video.platform === "youtube" ? "YouTube" : "TikTok";

  function handleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  }

  return (
    <div data-area="screen" className="flex flex-col items-center gap-4 lg:h-full">
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden rounded-2xl border border-foreground/15 bg-black shadow-2xl shadow-black/50 ${
          isPortrait
            ? "aspect-9/16 max-w-xs"
            : "aspect-video max-w-2xl lg:aspect-auto lg:max-w-none lg:min-h-0 lg:flex-1"
        }`}
      >
        <iframe
          key={video.id}
          src={video.platform === "youtube" ? `${video.embedUrl}?rel=0` : video.embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleFullscreen}
          className="flex items-center gap-1.5 rounded-full border border-accent/40 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/10"
        >
          <MaximizeIcon />
          Fullscreen
        </button>
        <a
          href={video.watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-foreground/15 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground/80 transition-colors hover:border-accent/50 hover:text-foreground"
        >
          Watch on {platformLabel}
        </a>
      </div>
    </div>
  );
}

export function TrashTalksSection({
  videos = TRASH_TALK_VIDEOS,
}: {
  videos?: TrashTalkVideo[];
}) {
  const [activeId, setActiveId] = useState(videos[0]?.id ?? DEFAULT_TRASH_TALK_VIDEO_ID);
  const activeVideo = videos.find((video) => video.id === activeId) ?? videos[0];
  const leftVideos = videos.filter((video) => video.side === "left");
  const rightVideos = videos.filter((video) => video.side === "right");

  return (
    <section
      id="trash-talks"
      className="scroll-mt-24 border-t border-foreground/10 bg-background px-4 py-14 sm:px-6 sm:py-32 lg:px-8"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center sm:gap-12">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
            ETFC 02 &middot; Trash Talks
          </span>
          <h2 className="mt-3 font-display text-4xl uppercase leading-[0.9] text-foreground sm:text-6xl lg:text-7xl">
            Trash Talks
          </h2>
          <p className="mx-auto mt-4 max-w-md text-foreground/70">
            What is there around the fights.
          </p>
        </div>

        <div className="trashtalk-grid w-full">
          <div data-area="left" className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-4">
            {leftVideos.map((video) => (
              <VideoTile
                key={video.id}
                video={video}
                active={video.id === activeId}
                onSelect={() => setActiveId(video.id)}
              />
            ))}
          </div>

          <TrashTalkScreen video={activeVideo} />

          <div data-area="right" className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-4">
            {rightVideos.map((video) => (
              <VideoTile
                key={video.id}
                video={video}
                active={video.id === activeId}
                onSelect={() => setActiveId(video.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
