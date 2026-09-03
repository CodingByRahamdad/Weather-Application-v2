import { cn } from "../../utils/cn";

export function Skeleton({ className, delay = 0, size = "default" }) {
  const sizeClasses = {
    sm: "h-3 rounded",
    default: "h-4 rounded-lg",
    lg: "h-6 rounded-lg",
    xl: "h-8 rounded-lg",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-ink-200 via-ink-100 to-ink-200 dark:from-ink-700 dark:via-ink-600 dark:to-ink-700",
        sizeClasses[size] ?? sizeClasses.default,
        className,
      )}
      style={{
        animation: "shimmer 2s infinite",
        animationDelay: `${delay * 50}ms`,
        backgroundSize: "1000px 100%",
      }}
    />
  );
}
