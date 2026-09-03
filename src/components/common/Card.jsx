import { cn } from "../../utils/cn";

export function Card({ className, children, padded = true, interactive, ...rest }) {
  return (
    <div
      {...rest}
      className={cn(
        /*
         * Soft, airy card styling:
         * – 24px radius for a pillowy, premium feel
         * – Very subtle border (#E1E6ED at 60% opacity)
         * – Diffused low-opacity shadow instead of hard drop-shadow
         * – Slight white inset glow for a glassy lift
         */
        "flex w-full flex-col rounded-[24px]",
        "border border-[#E1E6ED]/45",
        "bg-white/90 backdrop-blur-sm",
        "shadow-[0_1px_0_rgba(255,255,255,0.72)_inset,0_8px_32px_-18px_rgba(36,48,66,0.13)]",
        /* Dark mode */
        "dark:border-ink-600/28",
        "dark:bg-ink-900/80",
        "dark:shadow-[0_1px_0_rgba(255,255,255,0.025)_inset,0_8px_30px_-16px_rgba(0,0,0,0.38)]",
        padded && "p-5 sm:p-6",
        interactive && "transition-colors hover:border-accent-400/30 dark:hover:border-accent-400/22",
        className,
      )}
    >
      {children}
    </div>
  );
}
