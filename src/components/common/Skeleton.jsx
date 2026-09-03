import { cn } from "../../utils/cn";

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-ink-200/70 dark:bg-ink-700/60",
        className,
      )}
    />
  );
}
