export type Discipline = "mma" | "boxing" | "muaythai";

export interface DisciplineOption {
  id: Discipline;
  label: string;
  arenaName: string;
}

export const DISCIPLINES: DisciplineOption[] = [
  { id: "mma", label: "MMA", arenaName: "The Cage" },
  { id: "boxing", label: "Boxing", arenaName: "The Ring" },
  { id: "muaythai", label: "Muay Thai", arenaName: "The Ring" },
];

export const DEFAULT_DISCIPLINE: Discipline = DISCIPLINES[0].id;
