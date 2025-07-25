import { clsx } from "clsx";
import type { ComponentPropsWithRef } from "react";

type SudokuCellProps = {
  row: number;
  col: number;
} & ComponentPropsWithRef<"input">;

export function SudokuCell({
  row,
  col,
  className,
  readOnly,
  ...rest
}: SudokuCellProps) {
  return (
    <div
      className={clsx(
        "border-neutral-400",
        "first:rounded-tl-[3px] last:rounded-br-[3px] nth-[9]:rounded-tr-[3px] nth-[73]:rounded-bl-[3px]",
        col % 3 ? "border-r" : "border-x",
        row % 3 ? "border-b" : "border-y",
        className,
      )}
    >
      <input
        id={`cell-${row}-${col}`}
        aria-label={`Sudoku cell row:${row} col:${col}`}
        className={clsx(
          "w-full h-full px-2 md:px-3 caret-transparent rounded-md outline-hidden data-[active=true]:inset-ring-2 focus:inset-ring-2 inset-ring-indigo-500",
          readOnly && "font-semibold",
        )}
        type="text"
        inputMode="numeric"
        pattern="[1-9]"
        maxLength={1}
        readOnly={readOnly}
        {...rest}
      />
    </div>
  );
}
