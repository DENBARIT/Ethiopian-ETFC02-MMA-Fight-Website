export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ethiopian-etfc-02-mma-fight-website.vercel.app";

export const EVENT = {
  name: "Adwa Fight Night",
  nameAmharic: "የአድዋ የትግል ምሽት",
  tagline: "11 bouts, one card: boxing, Muay Thai and MMA under one roof.",
  description:
    "Adwa Fight Night (ETFC 02) hits Addis Ababa on 27 August. Main event: Sedo Martial Art vs Johnny Jitsu, plus 10 more bouts across boxing, Muay Thai and MMA.",
  date: "2026-08-27T18:00:00+03:00",
  readableDate: "27 August 2026",
  geezDate: "፳፯ ነሐሴ",
  venue: "Addis Ababa Arena",
  city: "Addis Ababa",
  country: "Ethiopia",
} as const;

export type PanelId = "L" | "R" | "Z";

export const PANEL_IMAGES: Record<PanelId, string[]> = {
  L: ["/landing/L1.png", "/landing/L2.png", "/landing/L3.png"],
  R: ["/landing/R1.png", "/landing/R2.png", "/landing/R3.png"],
  Z: ["/landing/Z1.png", "/landing/Z2.png", "/landing/Z3.png"],
};

export const PANEL_INTERVALS_MS: Record<PanelId, number> = {
  L: 7000,
  R: 4600,
  Z: 5700,
};

export interface Announcement {
  id: string;
  kicker: string;
  value: string;
  panel: PanelId;
}

export const ANNOUNCEMENTS: Announcement[] = [
  { id: "boxing", kicker: "Discipline", value: "4 Boxing Matches", panel: "R" },
  { id: "matches", kicker: "Fight Card", value: "11 Matches", panel: "L" },
  { id: "muaythai", kicker: "Discipline", value: "3 Muay Thai Combats", panel: "Z" },
  { id: "mma", kicker: "Discipline", value: "4 MMA Matches", panel: "R" },
  { id: "womens", kicker: "Title Fight", value: "1 Women's Title", panel: "L" },
  { id: "date", kicker: "Fight Night", value: "27 August", panel: "Z" },
];

export const ANNOUNCEMENT_HOLD_MS = 2600;
export const ANNOUNCEMENT_GAP_MS = 700;

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Who will win?", href: "/#who-will-win" },
  { label: "Trash Talks", href: "/#trash-talks" },
  { label: "Fight Tree", href: "/#fight-tree" },
  { label: "Sponsors", href: "/#sponsors" },
];
