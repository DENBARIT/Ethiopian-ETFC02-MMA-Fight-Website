export interface FightCardImage {
  src: string;
  width: number;
  height: number;
}

export interface FightCardFighter {
  name: string;
  /** One image = static portrait. Two+ = auto-crossfades between them. */
  images: string[];
}

export interface FightCardMatchup {
  id: string;
  /** Short label for the selector row. */
  tab: string;
  /** Full "A vs B" shown in the name bar. */
  fighters: string;
  /** Overlay text burned onto the card itself — main event only. */
  caption?: string;
  /** One image = static card. Two+ = auto-crossfades between them. */
  images: FightCardImage[];
  /** Contestant shown left/right of the cage, connected by the trace lines. */
  left: FightCardFighter;
  right: FightCardFighter;
}

export const MMA_FIGHT_CARDS: FightCardMatchup[] = [
  {
    id: "main",
    tab: "Main Event",
    fighters: "Sedo Martial Art vs Johnny Jitsu",
    caption: "MMA Bout · Main Match",
    images: [
      { src: "/who-will-win/cards/main-fight.png", width: 720, height: 1280 },
      { src: "/who-will-win/cards/m1.png", width: 323, height: 225 },
    ],
    left: {
      name: "Sedo Martial Art",
      images: ["/fighters/sedo/1.png", "/fighters/sedo/2.png", "/fighters/sedo/3.jpg"],
    },
    right: {
      name: "Johnny Jitsu",
      images: ["/fighters/johnny/1.png", "/fighters/johnny/2.png", "/fighters/johnny/3.jpeg"],
    },
  },
  {
    id: "m2",
    tab: "M2",
    fighters: "Boyka vs Edris",
    images: [{ src: "/who-will-win/cards/m2.png", width: 867, height: 840 }],
    left: {
      name: "Inspector Boyka",
      images: ["/fighters/boyka/1.png", "/fighters/boyka/2.png", "/fighters/boyka/3.png"],
    },
    right: {
      name: "Edris",
      images: ["/fighters/edris/1.png", "/fighters/edris/2.png"],
    },
  },
  {
    id: "m3",
    tab: "M3",
    fighters: "Nikatehilina vs Robel",
    images: [{ src: "/who-will-win/cards/m3.png", width: 866, height: 818 }],
    left: {
      name: "Nikatehilina",
      images: ["/fighters/nikatehilina/1.png"],
    },
    right: {
      name: "Robel",
      images: ["/fighters/robel/1.png", "/fighters/robel/2.png", "/fighters/robel/3.png"],
    },
  },
  {
    id: "m4",
    tab: "M4",
    fighters: "Elezar vs Kaleab",
    images: [{ src: "/who-will-win/cards/m4.png", width: 232, height: 176 }],
    left: {
      name: "Kaleab",
      images: ["/fighters/kaleab/1.png"],
    },
    right: {
      name: "Elezar",
      images: ["/fighters/elezar/1.png"],
    },
  },
];

export const DEFAULT_MMA_FIGHT_CARD = MMA_FIGHT_CARDS[0].id;
