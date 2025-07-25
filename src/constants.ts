export const DifficultyMap = {
  EASY: 53,
  MEDIUM: 45,
  HARD: 36,
} as const;

export type DifficultyLevel = keyof typeof DifficultyMap;
export const DifficultyLevels = Object.keys(DifficultyMap);
