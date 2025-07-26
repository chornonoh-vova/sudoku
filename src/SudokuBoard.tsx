import { clsx } from "clsx";
import { SudokuCell } from "./SudokuCell";

function boxIndex(row: number, col: number): number {
  return Math.trunc(row / 3) * 3 + Math.trunc(col / 3);
}

type SudokuBoardProps = {
  sudoku: number[][];
  solution: number[][];
  initialSudoku: number[][];
  focused: { row: number; col: number };
  updateCell: (rowIdx: number, colIdx: number, num: number) => void;
  onFocus: (focus: { row: number; col: number }) => void;
};

export function SudokuBoard({
  sudoku,
  solution,
  initialSudoku,
  focused,
  updateCell,
  onFocus,
}: SudokuBoardProps) {
  const focusedBox =
    focused.row === -1 && focused.col === -1
      ? -1
      : boxIndex(focused.row, focused.col);

  return (
    <div
      className="grid grid-cols-[repeat(9,_32px)] grid-rows-[repeat(9,_32px)] md:grid-cols-[repeat(9,_38px)] md:grid-rows-[repeat(9,_38px)] place-items-stretch rounded-[4px] border border-neutral-400 shadow-md font-mono md:text-xl"
      onKeyDown={(event) => {
        let num = parseInt(event.key);
        if (event.key === "Backspace" || event.key === "Delete") {
          num = 0;
        }
        if (!isNaN(num) && focused.row !== -1) {
          updateCell(focused.row, focused.col, num);
        }
      }}
    >
      {sudoku.map((row, rowIdx) =>
        row.map((val, colIdx) => {
          const initialVal = initialSudoku[rowIdx][colIdx];
          const invalid = solution[rowIdx][colIdx] !== val;
          const cellBox = boxIndex(rowIdx, colIdx);
          const highlighted =
            focused.row === rowIdx ||
            focused.col === colIdx ||
            cellBox === focusedBox;
          return (
            <SudokuCell
              key={`cell-${rowIdx}-${colIdx}`}
              row={rowIdx}
              col={colIdx}
              isInitial={initialVal !== 0}
              className={clsx(
                val !== 0 && invalid && "bg-red-500/20",
                highlighted && "bg-neutral-200",
              )}
              readOnly
              value={val ? val.toString() : ""}
              data-active={focused.row === rowIdx && focused.col === colIdx}
              onChange={(e) => {
                const num = parseInt(e.target.value || "0");
                if (!isNaN(num)) {
                  updateCell(rowIdx, colIdx, num);
                }
              }}
              onFocus={() => onFocus({ row: rowIdx, col: colIdx })}
            />
          );
        }),
      )}
    </div>
  );
}
