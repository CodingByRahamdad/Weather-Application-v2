import { Clock, MapPin, Trash2, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";

export function HistoryPage({ navigate }) {
  const { history, clearHistory, removeHistory, selectLocation, toast } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-ink-400">History</p>
        <h2 className="mt-1 font-display text-3xl text-ink-900 dark:text-ink-50 sm:text-4xl">
          Recent searches
        </h2>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">
          The last {history.length ? history.length : "five"} places you looked at. Stored only in this browser.
        </p>
      </div>

      <div className="flex justify-end">
        {history.length > 0 ? (
          <Button variant="outline" leftIcon={<Trash2 className="h-3.5 w-3.5" />} onClick={clearHistory}>
            Clear history
          </Button>
        ) : null}
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={<Clock className="h-10 w-10 text-sky-accent" />}
          title="Nothing searched yet"
          description="Search for a city on the dashboard and it'll show up here for quick access."
          action={<Button variant="primary" onClick={() => navigate("/weather")}>Go to dashboard</Button>}
        />
      ) : (
        <Card padded={false} className="overflow-hidden">
          <ul className="divide-y divide-[#E1E6ED]/60 dark:divide-ink-600/40">
            {history.map((h, idx) => (
              <li key={h.id} className="group flex items-center pr-3">
                <button
                  type="button"
                  onClick={() => {
                    selectLocation(h);
                    navigate("/weather");
                  }}
                  className="flex min-w-0 flex-1 items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-ink-100/70 dark:hover:bg-ink-800/70"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-white/55 text-accent-500 ring-1 ring-[#E1E6ED]/30 dark:bg-ink-700/70 dark:text-accent-300 dark:ring-ink-600/20">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-50">{h.name}</p>
                    <p className="truncate text-xs text-ink-400">
                      {[h.admin1, h.country].filter(Boolean).join(" · ") ||
                        `${h.latitude.toFixed(2)}, ${h.longitude.toFixed(2)}`}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-ink-400">
                    #{idx + 1}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    removeHistory(h.id);
                    toast({ kind: "info", title: "Removed from history", message: h.name });
                  }}
                  aria-label={`Delete ${h.name} from history`}
                  className="ml-1 rounded-[10px] p-1.5 text-ink-300 transition-colors hover:bg-error/10 hover:text-error dark:text-ink-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
