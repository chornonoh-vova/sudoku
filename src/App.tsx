import { useEffect, useState } from "react";
import { SudokuBoard } from "./SudokuBoard";
import { Controls } from "./Controls";
import { useSudoku } from "./useSudoku";
import { Numpad } from "./Numpad";
import { useDifficulty } from "./useDifficulty";
import { useMoveHistory } from "./useMoveHistory";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import type { TConductorInstance } from "react-canvas-confetti/dist/types";

function areEqual(solution: number[][], sudoku: number[][]) {
  for (let row = 0; row < 9; ++row) {
    for (let col = 0; col < 9; ++col) {
      if (solution[row][col] !== sudoku[row][col]) {
        return false;
      }
    }
  }

  return true;
}

function App() {
  const { difficulty, change } = useDifficulty();
  const { solution, initialSudoku, sudoku, update, regenerate } =
    useSudoku(difficulty);

  const [focused, setFocused] = useState({ row: -1, col: -1 });

  const { move, canUndo, undo, canRedo, redo } = useMoveHistory();

  const [conductor, setConductor] = useState<TConductorInstance | null>(null);

  useEffect(() => {
    if (areEqual(solution, sudoku)) {
      conductor?.run({
        speed: 3,
        duration: 3000,
        delay: 0,
      });
    }
  }, [solution, sudoku]);

  return (
    <main className="w-[100vw] h-[100vh] px-2 py-2 sm:py-4 sm:px-5 space-y-5">
      <h1 className="text-3xl text-center font-mono">Sudoku</h1>
      <div className="container grid md:grid-cols-2 gap-4 mx-auto">
        <section className="place-self-center md:self-center md:justify-self-end">
          <SudokuBoard
            sudoku={sudoku}
            solution={solution}
            initialSudoku={initialSudoku}
            focused={focused}
            updateCell={(row, col, num) => {
              move(row, col, sudoku[row][col], num);
              update(row, col, num);
            }}
            onFocus={setFocused}
          />
        </section>

        <aside className="flex flex-col place-self-center md:self-center md:justify-self-start gap-5">
          <Controls
            difficulty={difficulty}
            changeDifficulty={change}
            regenerate={regenerate}
            canUndo={canUndo()}
            undo={() => {
              const { row, col, num } = undo();
              if (num !== -1) {
                setFocused({ row, col });
                update(row, col, num);
              }
            }}
            canRedo={canRedo()}
            redo={() => {
              const { row, col, num } = redo();
              if (num !== -1) {
                setFocused({ row, col });
                update(row, col, num);
              }
            }}
          />

          <Numpad
            onNum={(num) => {
              const { row, col } = focused;
              if (row === -1 || col === -1) {
                return;
              }
              move(row, col, sudoku[row][col], num);
              update(row, col, num);
            }}
          />
        </aside>
      </div>

      <Fireworks onInit={({ conductor }) => setConductor(conductor)} />
    </main>
  );
}

export default App;
