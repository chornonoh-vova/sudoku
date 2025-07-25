import clsx from "clsx";
import type { ComponentPropsWithRef } from "react";

function NumpadButton({ className, ...rest }: ComponentPropsWithRef<"button">) {
  return (
    <button
      className={clsx(
        "py-2 px-4 rounded-md shadow-xs border border-neutral-300 hover:bg-neutral-100",
        className,
      )}
      {...rest}
    />
  );
}

type NumpadProps = {
  onNum: (num: number) => void;
};

export function Numpad({ onNum }: NumpadProps) {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 place-items-stretch">
      <NumpadButton onClick={() => onNum(1)}>1</NumpadButton>
      <NumpadButton onClick={() => onNum(2)}>2</NumpadButton>
      <NumpadButton onClick={() => onNum(3)}>3</NumpadButton>
      <NumpadButton onClick={() => onNum(4)}>4</NumpadButton>
      <NumpadButton onClick={() => onNum(5)}>5</NumpadButton>
      <NumpadButton onClick={() => onNum(6)}>6</NumpadButton>
      <NumpadButton onClick={() => onNum(7)}>7</NumpadButton>
      <NumpadButton onClick={() => onNum(8)}>8</NumpadButton>
      <NumpadButton onClick={() => onNum(9)}>9</NumpadButton>
    </div>
  );
}
