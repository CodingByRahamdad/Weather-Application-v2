import { Check, Info, X, AlertTriangle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";

export function Toasts() {
  const { toasts, dismissToast } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6">
      {toasts.map((t) => {
        const Icon = t.kind === "success" ? Check : t.kind === "error" ? AlertTriangle : Info;
        const color =
          t.kind === "success"
            ? "text-success"
            : t.kind === "error"
            ? "text-error"
            : "text-accent-400";
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[20px] border border-[#E1E6ED]/45 bg-white/90 p-3 shadow-[0_10px_36px_-20px_rgba(11,15,20,0.16)] backdrop-blur-xl",
              "dark:border-ink-600/30 dark:bg-ink-800/90",
            )}
          >
            <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", color)} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-900 dark:text-ink-50">{t.title}</p>
              {t.message ? (
                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-300">{t.message}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-100"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
