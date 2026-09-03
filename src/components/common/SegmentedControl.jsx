import { cn } from "../../utils/cn";

export function SegmentedControl({
  value,
  options,
  onChange,
  size = "md",
  fullWidth,
  ariaLabel,
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-[16px] border border-[#E1E6ED]/45 bg-white/55 p-1 dark:border-ink-600/30 dark:bg-ink-800/55",
        fullWidth && "w-full",
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center rounded-[12px] transition-colors",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
              active
                ? "bg-accent-400 text-ink-950 shadow-[0_3px_12px_-7px_rgba(20,184,166,0.45)]"
                : "text-ink-500 hover:text-ink-800 dark:text-ink-300 dark:hover:text-ink-50",
            )}
          >
            <span className="font-medium leading-tight">{opt.label}</span>
            {opt.sublabel ? (
              <span className={cn("text-[10px] leading-tight", active ? "text-ink-950/70" : "text-ink-400")}>
                {opt.sublabel}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
