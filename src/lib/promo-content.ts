export type PromoCategory = "Boxing" | "MMA" | "Muaythai" | "Main Combat";

export interface PromoCard {
  id: string;
  src: string;
  width: number;
  height: number;
  category: PromoCategory;
  alt: string;
}

// Split across the two rails so each side cycles its own subset instead of
// racing through the same 10 cards in lockstep.
export const PROMO_CARDS_LEFT: PromoCard[] = [
  {
    id: "boxing-l",
    src: "/fight-tree/promo/boxing-l.png",
    width: 207,
    height: 161,
    category: "Boxing",
    alt: "Biniam vs Esubalew — Boxing Match",
  },
  {
    id: "boxing-r",
    src: "/fight-tree/promo/boxing-r.png",
    width: 210,
    height: 158,
    category: "Boxing",
    alt: "Desalegn vs Surafel — Boxing Match",
  },
  {
    id: "mma-m",
    src: "/fight-tree/promo/mma-m.png",
    width: 223,
    height: 156,
    category: "MMA",
    alt: "Edris vs Boyka — MMA Bout",
  },
  {
    id: "muaythai-l",
    src: "/fight-tree/promo/muaythai-l.png",
    width: 202,
    height: 162,
    category: "Muaythai",
    alt: "Rebik vs Stephen — Muay Thai Match",
  },
  {
    id: "muaythai-r",
    src: "/fight-tree/promo/muaythai-r.png",
    width: 181,
    height: 147,
    category: "Muaythai",
    alt: "Zahara vs Yabsira — Muay Thai Match",
  },
];

export const PROMO_CARDS_RIGHT: PromoCard[] = [
  {
    id: "boxing-m",
    src: "/fight-tree/promo/boxing-m.png",
    width: 198,
    height: 165,
    category: "Boxing",
    alt: "Haymanot vs Abreham — Boxing Match",
  },
  {
    id: "mma-l",
    src: "/fight-tree/promo/mma-l.png",
    width: 232,
    height: 176,
    category: "MMA",
    alt: "Elezar vs Kaleab — MMA Bout",
  },
  {
    id: "mma-r",
    src: "/fight-tree/promo/mma-r.png",
    width: 207,
    height: 166,
    category: "MMA",
    alt: "Robel vs Nikatehilina — MMA Bout",
  },
  {
    id: "muaythai-m",
    src: "/fight-tree/promo/muaythai-m.png",
    width: 182,
    height: 161,
    category: "Muaythai",
    alt: "Habtamu vs Frezer — Muay Thai Match",
  },
  {
    id: "main-match",
    src: "/fight-tree/promo/main-match.png",
    width: 328,
    height: 230,
    category: "Main Combat",
    alt: "Sedo vs Jhonny — Middleweight MMA main event",
  },
];
