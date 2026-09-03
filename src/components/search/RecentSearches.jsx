import { Clock, MapPin, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card } from "../common/Card";

export function RecentSearches({ onSelect }) {
  const { history, clearHistory, removeHistory, selectedLocation, toast } = useApp();

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-semibold text-ink-900 dark:text-ink-50">
          <Clock className="h-4 w-4 text-sky-accent" />
          Recent searches
        </h3>
        {history.length > 0 ? (
          <button type="button" onClick={clearHistory} className="text-xs text-ink-400 hover:text-error">
            Clear
          </button>
        ) : null}
      </div>

      {history.length === 0 ? (
        <p className="mt-4 rounded-[18px] border border-dashed border-[#E1E6ED]/55 bg-white/20 py-6 text-center text-sm text-ink-500 dark:border-ink-600/35 dark:bg-ink-800/20 dark:text-ink-300">
          Your last five searches will appear here.
        </p>
      ) : (
        <ul className="mt-3 space-y-1.5">
          {history.map((h, idx) => (
            <li key={h.id}>
              <div
                className={`group flex items-center gap-3 rounded-[16px] px-2.5 py-2 transition-colors ${
                  selectedLocation?.id === h.id
                    ? "bg-accent-400/10 text-ink-900 dark:text-ink-50"
                    : "hover:bg-ink-100/70 dark:hover:bg-ink-800"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(h)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-white/60 text-accent-500 ring-1 ring-[#E1E6ED]/30 dark:bg-ink-700 dark:text-accent-300 dark:ring-ink-600/20">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-50">{h.name}</p>
                    <p className="truncate text-[11px] text-ink-400">
                      {[h.admin1, h.country].filter(Boolean).join(" · ") ||
                        `${h.latitude.toFixed(2)}, ${h.longitude.toFixed(2)}`}
                    </p>
                  </div>
                </button>

                <div className="flex shrink-0 items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase text-ink-400">
                    {idx === 0 ? "Just now" : `#${idx + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      removeHistory(h.id);
                      toast({ kind: "info", title: "Removed from history", message: h.name });
                    }}
                    aria-label={`Remove ${h.name} from history`}
                    className="rounded-[8px] p-1 text-ink-300 transition-colors hover:bg-error/10 hover:text-error dark:text-ink-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
