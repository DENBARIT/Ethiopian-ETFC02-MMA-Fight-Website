import type { FightCardFighter, FightCardImage } from "@/lib/mma-fight-card-content";

export interface BoxingCardMatchup {
  id: string;
  /** Short label for the selector row. */
  tab: string;
  /** Full "A vs B" shown in the name bar. */
  fighters: string;
  /** Promo poster shown standing in the ring. */
  images: FightCardImage[];
  /** Contestant shown left/right of the ring, connected by the trace lines. */
  left: FightCardFighter;
  right: FightCardFighter;
}

export const BOXING_FIGHT_CARDS: BoxingCardMatchup[] = [
  {
    id: "b1",
    tab: "B1",
    fighters: "Biniyam vs Esubalew",
    images: [{ src: "/who-will-win/cards/b1.png", width: 875, height: 841 }],
    left: {
      name: "Biniyam",
      images: ["/boxers/biniyam/1.png"],
    },
    right: {
      name: "Esubalew",
      images: ["/boxers/esubalew/1.png", "/boxers/esubalew/2.png"],
    },
  },
  {
    id: "b2",
    tab: "B2",
    fighters: "Haymanot vs Abreham",
    images: [{ src: "/who-will-win/cards/b2.png", width: 203, height: 157 }],
    left: {
      name: "Haymanot",
      images: ["/boxers/haymanot/1.png", "/boxers/haymanot/2.png"],
    },
    right: {
      name: "Abreham",
      images: ["/boxers/abreham/1.png"],
    },
  },
  {
    id: "b3",
    tab: "B3",
    fighters: "Desalegn vs Surafel",
    images: [{ src: "/who-will-win/cards/b3.png", width: 891, height: 823 }],
    left: {
      name: "Desalegn",
      images: ["/boxers/desalegn/1.png"],
    },
    right: {
      name: "Surafel",
      images: ["/boxers/surafel/1.png"],
    },
  },
  {
    id: "b4",
    tab: "B4",
    fighters: "Mesfin vs Abenezer",
    images: [{ src: "/who-will-win/cards/b4.png", width: 916, height: 833 }],
    left: {
      name: "Mesfin",
      images: ["/boxers/mesfin/1.png"],
    },
    right: {
      name: "Abenezer",
      images: ["/boxers/abenezer/1.png"],
    },
  },
];

export const DEFAULT_BOXING_FIGHT_CARD = BOXING_FIGHT_CARDS[0].id;
