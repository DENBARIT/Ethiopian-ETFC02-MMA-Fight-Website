"use client";

import { useCallback, useEffect, useState } from "react";

export type VoteSide = "left" | "right";

interface VoteCounts {
  left: number;
  right: number;
}

const VOTER_ID_KEY = "etfc-voter-id";

function getVoterId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(VOTER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VOTER_ID_KEY, id);
  }
  return id;
}

function votedSideKey(fightId: string) {
  return `etfc-voted-${fightId}`;
}

/** Vote counts + cast-a-vote for one fight, backed by /api/votes. Tracks
 * whether this browser already voted (localStorage, keyed per fight) so
 * the buttons lock in immediately without waiting on the network, and the
 * server's unique constraint is the actual source of truth if that ever
 * disagrees (cleared storage, another tab, etc). */
export function useFightVotes(fightId: string) {
  const [counts, setCounts] = useState<VoteCounts | null>(null);
  const [votedSide, setVotedSide] = useState<VoteSide | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    // Resetting for the newly selected fight, not reacting to an external system.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCounts(null);
    setVotedSide(
      (window.localStorage.getItem(votedSideKey(fightId)) as VoteSide | null) ?? null,
    );

    let cancelled = false;
    fetch(`/api/votes?fightId=${encodeURIComponent(fightId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setCounts(data.counts);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [fightId]);

  const vote = useCallback(
    (side: VoteSide) => {
      if (votedSide || pending) return;

      setPending(true);
      setVotedSide(side);
      setCounts((prev) => (prev ? { ...prev, [side]: prev[side] + 1 } : prev));
      window.localStorage.setItem(votedSideKey(fightId), side);

      fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fightId, side, voterId: getVoterId() }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!data) return;
          // Server is authoritative — if this voter had already voted a
          // different side (e.g. from another tab), snap to that instead.
          setVotedSide(data.side);
          setCounts(data.counts);
          window.localStorage.setItem(votedSideKey(fightId), data.side);
        })
        .catch(() => {})
        .finally(() => setPending(false));
    },
    [fightId, votedSide, pending],
  );

  return { counts, votedSide, vote };
}
