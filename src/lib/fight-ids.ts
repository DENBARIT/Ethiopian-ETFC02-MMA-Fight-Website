import { BOXING_FIGHT_CARDS } from "@/lib/boxing-fight-card-content";
import { MMA_FIGHT_CARDS } from "@/lib/mma-fight-card-content";
import { MUAYTHAI_FIGHT_CARDS } from "@/lib/muaythai-fight-card-content";

/** Every valid fight id across all three disciplines — used to reject
 * votes/comments for fights that don't exist. */
export const ALL_FIGHT_IDS: string[] = [
  ...MMA_FIGHT_CARDS.map((c) => c.id),
  ...BOXING_FIGHT_CARDS.map((c) => c.id),
  ...MUAYTHAI_FIGHT_CARDS.map((c) => c.id),
];

export function isValidFightId(id: unknown): id is string {
  return typeof id === "string" && ALL_FIGHT_IDS.includes(id);
}
