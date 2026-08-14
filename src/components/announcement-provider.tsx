"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  ANNOUNCEMENTS,
  ANNOUNCEMENT_GAP_MS,
  ANNOUNCEMENT_HOLD_MS,
  type Announcement,
  type PanelId,
} from "@/lib/landing-content";

interface AnnouncementState {
  current: Announcement;
  visible: boolean;
}

const AnnouncementContext = createContext<AnnouncementState>({
  current: ANNOUNCEMENTS[0],
  visible: true,
});

export function AnnouncementProvider({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Resets visibility for the new announcement each time `index` advances;
    // the hide/advance timers below are what actually drive the cycle.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    const holdTimer = setTimeout(() => {
      setVisible(false);
    }, ANNOUNCEMENT_HOLD_MS);

    const gapTimer = setTimeout(() => {
      setIndex((current) => (current + 1) % ANNOUNCEMENTS.length);
    }, ANNOUNCEMENT_HOLD_MS + ANNOUNCEMENT_GAP_MS);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(gapTimer);
    };
  }, [index]);

  return (
    <AnnouncementContext.Provider value={{ current: ANNOUNCEMENTS[index], visible }}>
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncement(panel: PanelId) {
  const { current, visible } = useContext(AnnouncementContext);
  if (current.panel !== panel) return null;
  return { ...current, visible };
}
