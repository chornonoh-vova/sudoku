import { clsx } from "clsx";
import type { ComponentPropsWithRef } from "react";

export function Button({
  className,
  ...rest
}: ComponentPropsWithRef<"button">) {
  return (
    <button
      className={clsx(
        "inline-flex items-center px-3.5 py-1.5 gap-1 rounded-full shadow-sm bg-indigo-500 disabled:bg-neutral-200 disabled:text-black active:bg-indigo-400 hover:bg-indigo-400 text-white",
        className,
      )}
      {...rest}
    />
  );
}
