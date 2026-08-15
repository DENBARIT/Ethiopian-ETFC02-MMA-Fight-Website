import type { FightCardFighter, FightCardImage } from "@/lib/mma-fight-card-content";

export interface MuayThaiCardMatchup {
  id: string;
  /** Short label for the selector row. */
  tab: string;
  /** Full "A vs B" shown in the name bar. */
  fighters: string;
  /** Overlay text burned onto the card itself — special matchups only. */
  caption?: string;
  /** Promo poster shown standing in the cage. */
  images: FightCardImage[];
  /** Contestant shown left/right of the cage, connected by the trace lines. */
  left: FightCardFighter;
  right: FightCardFighter;
}

export const MUAYTHAI_FIGHT_CARDS: MuayThaiCardMatchup[] = [
  {
    id: "t1",
    tab: "T1",
    fighters: "Rebik vs Stephen",
    caption: "Muay Thai · International Fight",
    images: [{ src: "/who-will-win/cards/t1.png", width: 202, height: 162 }],
    left: {
      name: "Rebik",
      images: ["/muaythai-fighters/rebik/1.png"],
    },
    right: {
      name: "Stephen",
      images: ["/muaythai-fighters/stephen/1.png"],
    },
  },
  {
    id: "t2",
    tab: "T2",
    fighters: "Habtamu vs Frezer",
    images: [{ src: "/who-will-win/cards/t2.png", width: 182, height: 161 }],
    left: {
      name: "Habtamu",
      images: ["/muaythai-fighters/habtamu/1.png"],
    },
    right: {
      name: "Frezer",
      images: ["/muaythai-fighters/frezer/1.png"],
    },
  },
  {
    id: "t3",
    tab: "T3",
    fighters: "Yeamlaksira vs Zehara",
    caption: "The Only Female Match",
    images: [{ src: "/who-will-win/cards/t3.png", width: 857, height: 801 }],
    left: {
      name: "Yeamlaksira",
      images: ["/muaythai-fighters/yeamlaksira/1.png", "/muaythai-fighters/yeamlaksira/2.png"],
    },
    right: {
      name: "Zehara",
      images: ["/muaythai-fighters/zehara/1.png", "/muaythai-fighters/zehara/2.png"],
    },
  },
];

export const DEFAULT_MUAYTHAI_FIGHT_CARD = MUAYTHAI_FIGHT_CARDS[0].id;
