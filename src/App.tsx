import { useState } from "react";
import { SudokuBoard } from "./SudokuBoard";
import { Controls } from "./Controls";
import { useSudoku } from "./useSudoku";
import { Numpad } from "./Numpad";
import { useDifficulty } from "./useDifficulty";
import { useMoveHistory } from "./useMoveHistory";

const DIRECTIONS = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

function App() {
  const { difficulty, change } = useDifficulty();
  const { solution, initialSudoku, sudoku, update, regenerate } =
    useSudoku(difficulty);

  const [focused, setFocused] = useState({ row: -1, col: -1 });

  const { move, canUndo, undo, canRedo, redo } = useMoveHistory();

  return (
    <main className="w-[100vw] h-[100vh] py-4 px-5 space-y-5">
      <h1 className="text-3xl text-center font-mono">Sudoku</h1>
      <div className="container grid md:grid-cols-2 gap-4 mx-auto">
        <section className="place-self-center">
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

        <aside className="flex flex-col place-self-center gap-5">
          <Controls
            difficulty={difficulty}
            changeDifficulty={change}
            regenerate={regenerate}
            hint={() => {}}
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
              move(row, col, sudoku[row][col], num);
              update(row, col, num);
            }}
          />
        </aside>
      </div>
    </main>
  );
}

export default App;
