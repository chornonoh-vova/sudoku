import { Lightbulb, Redo, RefreshCcw, Undo } from "lucide-react";
import { Button } from "./Button";
import type { DifficultyLevel } from "./constants";

type ControlsProps = {
  difficulty: DifficultyLevel;
  changeDifficulty: (newDifficulty: DifficultyLevel) => void;
  regenerate: () => void;
  hint: () => void;
  canUndo: boolean;
  undo: () => void;
  canRedo: boolean;
  redo: () => void;
};

export function Controls({
  difficulty,
  changeDifficulty,
  regenerate,
  hint,
  canUndo,
  undo,
  canRedo,
  redo,
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row flex-wrap gap-2 justify-center">
        <Button onClick={regenerate}>
          <RefreshCcw className="size-4" />
          Re-generate
        </Button>
        <div className="flex flex-row items-center px-3 py-1.5 border border-neutral-200 rounded-full">
          <label htmlFor="difficulty-select">Difficulty:</label>
          <select
            id="difficulty-select"
            value={difficulty}
            onChange={(e) =>
              changeDifficulty(e.target.value as DifficultyLevel)
            }
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-2 justify-center">
        <Button onClick={hint}>
          <Lightbulb className="size-4" />
          Hint
        </Button>
        <Button disabled={!canUndo} onClick={undo}>
          <Undo className="size-4" />
          Undo
        </Button>
        <Button disabled={!canRedo} onClick={redo}>
          <Redo className="size-4" />
          Redo
        </Button>
      </div>
    </div>
  );
}
