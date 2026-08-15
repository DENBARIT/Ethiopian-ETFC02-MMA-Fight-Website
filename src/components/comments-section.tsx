"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CommentItem {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

const PAGE_SIZE = 6;

function timeAgo(iso: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)}m ago`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}h ago`;
  const days = hours / 24;
  return `${Math.floor(days)}d ago`;
}

function PostIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12 20 4l-6.5 16-3-6.5L4 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Per-fight comment thread — mounted once per scene, keyed by fightId so
 * switching fights (or disciplines) swaps in that fight's own thread. */
export function CommentsSection({ fightId }: { fightId: string }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const offsetRef = useRef(0);

  useEffect(() => {
    offsetRef.current = 0;
    // Resetting for the newly selected fight, not reacting to an external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setComments([]);
    setHasMore(false);

    let cancelled = false;
    fetch(`/api/comments?fightId=${encodeURIComponent(fightId)}&limit=${PAGE_SIZE}&offset=0`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setComments(data.comments);
        setHasMore(data.hasMore);
        offsetRef.current = data.comments.length;
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [fightId]);

  const loadMore = () => {
    setLoadingMore(true);
    fetch(
      `/api/comments?fightId=${encodeURIComponent(fightId)}&limit=${PAGE_SIZE}&offset=${offsetRef.current}`,
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setComments((prev) => [...prev, ...data.comments]);
        setHasMore(data.hasMore);
        offsetRef.current += data.comments.length;
      })
      .finally(() => setLoadingMore(false));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || posting) return;

    setPosting(true);
    fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fightId, author, body: trimmed }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setComments((prev) => [data.comment, ...prev]);
        offsetRef.current += 1;
        setBody("");
      })
      .finally(() => setPosting(false));
  };

  return (
    <div className="mt-14 w-full max-w-4xl sm:mt-16">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
        Fan Talk
      </span>
      <h3 className="mt-1 font-display text-2xl uppercase leading-none text-foreground sm:text-3xl">
        Comments
      </h3>

      <form
        onSubmit={submit}
        className="mt-5 flex flex-col gap-2 rounded-2xl border border-foreground/15 bg-foreground/[0.03] p-3 sm:flex-row sm:items-center sm:gap-3"
      >
        <input
          type="text"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="Name (optional)"
          maxLength={40}
          className="w-full shrink-0 rounded-full border border-foreground/15 bg-background px-4 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none sm:w-40"
        />
        <input
          type="text"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Say something about this fight…"
          maxLength={500}
          className="w-full flex-1 rounded-full border border-foreground/15 bg-background px-4 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!body.trim() || posting}
          aria-label="Post comment"
          className="flex shrink-0 items-center justify-center gap-1.5 self-end rounded-full bg-accent px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-background transition-opacity disabled:opacity-40 sm:self-auto"
        >
          <PostIcon />
          Post
        </button>
      </form>

      <div className="mt-6">
        {loading ? (
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-foreground/40">
            Loading comments&hellip;
          </p>
        ) : comments.length === 0 ? (
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-foreground/40">
            No comments yet — be the first to sound off.
          </p>
        ) : (
          <AnimatePresence initial={false}>
            <motion.div
              layout
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4 text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-display text-sm uppercase text-accent">
                      {comment.author}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-foreground/40">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-pretty text-sm text-foreground/85">{comment.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="rounded-full border border-accent/40 px-5 py-2 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
            >
              {loadingMore ? "Loading…" : "See more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
