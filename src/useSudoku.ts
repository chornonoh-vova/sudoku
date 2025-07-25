import { useEffect, useState } from "react";
import { DifficultyMap, type DifficultyLevel } from "./constants";

class SudokuState {
  #rows: Uint16Array;
  #cols: Uint16Array;
  #boxes: Uint16Array;

  constructor() {
    this.#rows = new Uint16Array(9);
    this.#cols = new Uint16Array(9);
    this.#boxes = new Uint16Array(9);
  }

  #boxIndex(row: number, col: number): number {
    return Math.trunc(row / 3) * 3 + Math.trunc(col / 3);
  }

  canPlace(row: number, col: number, num: number): boolean {
    const box = this.#boxIndex(row, col);
    const mask = 1 << (num - 1);

    return !(
      this.#rows[row] & mask ||
      this.#cols[col] & mask ||
      this.#boxes[box] & mask
    );
  }

  place(row: number, col: number, num: number) {
    const box = this.#boxIndex(row, col);
    const mask = 1 << (num - 1);

    this.#rows[row] |= mask;
    this.#cols[col] |= mask;
    this.#boxes[box] |= mask;
  }

  remove(row: number, col: number, num: number) {
    const box = this.#boxIndex(row, col);
    const mask = 1 << (num - 1);

    this.#rows[row] ^= mask;
    this.#cols[col] ^= mask;
    this.#boxes[box] ^= mask;
  }
}

function shuffle<T>(nums: T[]): T[] {
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
}

function generateSolution(): number[][] {
  const grid = Array.from({ length: 9 }, () => new Array(9).fill(0));
  const state = new SudokuState();

  function fill(row: number, col: number): boolean {
    if (row === 9) {
      return true;
    }

    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = col === 8 ? 0 : col + 1;

    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of nums) {
      if (state.canPlace(row, col, num)) {
        state.place(row, col, num);
        grid[row][col] = num;

        if (fill(nextRow, nextCol)) {
          return true;
        }

        state.remove(row, col, num);
        grid[row][col] = 0;
      }
    }

    return false;
  }

  fill(0, 0);

  return grid;
}

function countSolutions(board: number[][]): number {
  let count = 0;
  const state = new SudokuState();

  for (let row = 0; row < 9; ++row) {
    for (let col = 0; col < 9; ++col) {
      if (!board[row][col]) continue;
      state.place(row, col, board[row][col]);
    }
  }

  function solve(): boolean {
    for (let row = 0; row < 9; ++row) {
      for (let col = 0; col < 9; ++col) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; ++num) {
            if (state.canPlace(row, col, num)) {
              state.place(row, col, num);
              board[row][col] = num;

              solve(); // no need to check return value here

              state.remove(row, col, num);
              board[row][col] = 0;

              if (count > 1) return true; // early exit
            }
          }

          // No number can be placed — backtrack
          return false;
        }
      }
    }

    count++;
    return false;
  }

  solve();

  return count;
}

function generatePuzzle(grid: number[][], minClues = 32) {
  const puzzle = structuredClone(grid);
  const positions = [];

  for (let row = 0; row < 9; ++row) {
    for (let col = 0; col < 9; ++col) {
      positions.push([row, col]);
    }
  }

  shuffle(positions);

  for (const [row, col] of positions) {
    const temp = puzzle[row][col];
    puzzle[row][col] = 0;

    const clone = structuredClone(puzzle);
    const solutions = countSolutions(clone);

    if (solutions !== 1) {
      puzzle[row][col] = temp;
    }

    const clueCount = puzzle.flat().filter((n) => n !== 0).length;
    if (clueCount <= minClues) break;
  }

  return puzzle;
}

const SUDOKU_SOLUTION_KEY = "SUDOKU_SOLUTION";
const SUDOKU_INITIAL_KEY = "SUDOKU_INITIAL";
const SUDOKU_CURRENT_KEY = "SUDOKU_CURRENT";

export function useSudoku(difficulty: DifficultyLevel = "EASY") {
  const clueCount = DifficultyMap[difficulty];

  const [solution, setSolution] = useState(() => {
    const fromStorage = localStorage.getItem(SUDOKU_SOLUTION_KEY);
    let solution: number[][] | undefined = undefined;

    if (fromStorage) {
      try {
        solution = JSON.parse(fromStorage);
      } catch (error) {
        console.error("Error parsing solution from storage", error);
        localStorage.removeItem(SUDOKU_SOLUTION_KEY);
      }
    }

    if (!solution) {
      solution = generateSolution();
    }

    return solution;
  });

  const [initialSudoku, setInitialSudoku] = useState(() => {
    const fromStorage = localStorage.getItem(SUDOKU_INITIAL_KEY);
    let initial: number[][] | undefined = undefined;

    if (fromStorage) {
      try {
        initial = JSON.parse(fromStorage);
      } catch (error) {
        console.error("Error parsing initial sudoku from storage", error);
        localStorage.removeItem(SUDOKU_INITIAL_KEY);
      }
    }

    if (!initial) {
      initial = generatePuzzle(solution, clueCount);
    }

    return initial;
  });

  const [sudoku, setSudoku] = useState(() => {
    const fromStorage = localStorage.getItem(SUDOKU_CURRENT_KEY);
    let current: number[][] | undefined = undefined;

    if (fromStorage) {
      try {
        current = JSON.parse(fromStorage);
      } catch (error) {
        console.error("Error parsing current sudoku from storage", error);
        localStorage.removeItem(SUDOKU_CURRENT_KEY);
      }
    }

    if (!current) {
      current = initialSudoku;
    }

    return current;
  });

  const update = (row: number, col: number, num: number) => {
    setSudoku((prev) => {
      const next = structuredClone(prev);
      next[row][col] = num;
      return next;
    });
  };

  const regenerate = () => {
    const newSolution = generateSolution();
    const newInitialSudoku = generatePuzzle(newSolution, clueCount);
    setSolution(newSolution);
    setInitialSudoku(newInitialSudoku);
    setSudoku(newInitialSudoku);
  };

  useEffect(() => {
    localStorage.setItem(SUDOKU_SOLUTION_KEY, JSON.stringify(solution));
  }, [solution]);

  useEffect(() => {
    localStorage.setItem(SUDOKU_INITIAL_KEY, JSON.stringify(initialSudoku));
  }, [initialSudoku]);

  useEffect(() => {
    localStorage.setItem(SUDOKU_CURRENT_KEY, JSON.stringify(sudoku));
  }, [sudoku]);

  return {
    solution,
    initialSudoku,
    sudoku,
    update,
    regenerate,
  };
}
