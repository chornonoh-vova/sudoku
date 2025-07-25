import { useEffect, useState } from "react";
import { DifficultyLevels, type DifficultyLevel } from "./constants";

const DIFFICULTY_KEY = "SUDOKU_DIFFICULTY";

export function useDifficulty() {
  const [difficulty, setDifficulty] = useState(() => {
    const stored = localStorage.getItem(DIFFICULTY_KEY);
    if (stored && DifficultyLevels.includes(stored)) {
      return stored as DifficultyLevel;
    }

    return "EASY";
  });

  const change = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);
  };

  useEffect(() => {
    localStorage.setItem(DIFFICULTY_KEY, difficulty);
  }, [difficulty]);

  return { difficulty, change };
}
