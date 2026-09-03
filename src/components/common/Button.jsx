import { cn } from "../../utils/cn";

const VARIANTS = {
  primary:
    "bg-accent-400 text-ink-950 hover:bg-accent-300 disabled:bg-accent-400/50 font-medium",
  secondary:
    "bg-ink-100 text-ink-900 hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-50 dark:hover:bg-ink-600 font-medium",
  ghost:
    "bg-transparent text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800",
  danger:
    "bg-error/10 text-error hover:bg-error/20 border border-error/20",
  outline:
    "bg-transparent text-ink-800 border border-[#E1E6ED]/80 hover:bg-white/60 dark:text-ink-100 dark:border-ink-600/50 dark:hover:bg-ink-800",
};

const SIZES = {
  sm: "text-xs px-3 py-1.5 gap-1.5 rounded-[12px]",
  md: "text-sm px-3.5 py-2 gap-2 rounded-[16px]",
  lg: "text-sm px-4 py-2.5 gap-2 rounded-[16px]",
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  leftIcon,
  rightIcon,
  children,
  ...rest
}) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-accent-400 disabled:opacity-60 disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
