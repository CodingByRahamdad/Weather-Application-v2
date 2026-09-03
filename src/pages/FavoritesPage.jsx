import { useMemo, useState } from "react";
import { ArrowUpDown, LayoutGrid, Plus, Star } from "lucide-react";
import { useApp } from "../context/AppContext";
import { FavoriteCard } from "../components/favorites/FavoriteCard";
import { useFavoriteWeather } from "../hooks/useFavoriteWeather";
import { EmptyState } from "../components/common/EmptyState";
import { Button } from "../components/common/Button";
import { cn } from "../utils/cn";

export function FavoritesPage({ navigate }) {
  const { favorites, selectedLocation, selectLocation, removeFavorite, toast } = useApp();
  const [sort, setSort] = useState("added");
  const [view, setView] = useState("grid");

  const bundles = useFavoriteWeather(favorites);

  const ordered = useMemo(() => {
    const copy = [...favorites];
    // Legacy favourites retain their insertion order; newer entries carry a timestamp.
    const legacyOrder = new Map(favorites.map((favorite, index) => [favorite.id, index]));
    if (sort === "added") {
      copy.sort((a, b) => {
        const newestFirst =
          (b.addedAt ?? legacyOrder.get(b.id) ?? 0) -
          (a.addedAt ?? legacyOrder.get(a.id) ?? 0);
        return newestFirst || (legacyOrder.get(b.id) ?? 0) - (legacyOrder.get(a.id) ?? 0);
      });
    }
    if (sort === "name") copy.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "temp")
      copy.sort(
        (a, b) =>
          (bundles[b.id]?.bundle?.current.temperatureC ?? -Infinity) -
          (bundles[a.id]?.bundle?.current.temperatureC ?? -Infinity),
      );
    return copy;
  }, [favorites, sort, bundles]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-ink-400">Favorites</p>
        <h2 className="mt-1 font-display text-3xl text-ink-900 dark:text-ink-50 sm:text-4xl">
          Your saved locations
        </h2>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">
          {favorites.length} of 20 slots used · syncs across devices with the same browser
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1.5 rounded-[16px] border border-[#E1E6ED]/45 bg-white/50 px-3 py-1.5 text-sm text-ink-500 dark:border-ink-600/30 dark:bg-ink-800/50 dark:text-ink-300">
          <ArrowUpDown className="h-4 w-4" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent text-sm outline-none"
            aria-label="Sort favorites"
          >
            <option value="added">Recently added</option>
            <option value="name">By name</option>
            <option value="temp">Warmest first</option>
          </select>
        </label>
        <div className="inline-flex items-center gap-0.5 rounded-[16px] border border-[#E1E6ED]/45 bg-white/50 p-1 dark:border-ink-600/30 dark:bg-ink-800/50">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            className={cn(
              "flex items-center gap-1.5 rounded-[12px] px-2.5 py-1 text-xs transition-colors",
              view === "grid"
                ? "bg-white text-ink-900 shadow-[0_4px_14px_-10px_rgba(11,15,20,0.2)] dark:bg-ink-700 dark:text-ink-50"
                : "text-ink-500",
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> View
          </button>
        </div>
        <Button
          variant="primary"
          className="ml-auto"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => navigate("/weather")}
        >
          Add a city
        </Button>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<Star className="h-10 w-10 text-warning" />}
          title="No favorites yet"
          description="Save cities you check often. They'll appear here with a live snapshot."
          action={<Button variant="primary" onClick={() => navigate("/weather")}>Find a city</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ordered.map((loc) => {
            const entry = bundles[loc.id];
            return (
              <FavoriteCard
                key={loc.id}
                location={loc}
                bundle={entry?.bundle ?? null}
                loading={entry?.loading ?? true}
                isCurrent={selectedLocation?.id === loc.id}
                onSelect={() => {
                  selectLocation(loc);
                  navigate("/weather");
                }}
                onRemove={() => {
                  removeFavorite(loc.id);
                  toast({ kind: "info", title: "Removed", message: loc.name });
                }}
              />
            );
          })}

          <button
            type="button"
            onClick={() => navigate("/weather")}
            className="flex min-h-[260px] flex-col items-center justify-center gap-2 rounded-[24px] border border-dashed border-[#E1E6ED]/55 bg-white/20 text-ink-400 transition-colors hover:border-accent-400/30 hover:text-accent-500 dark:border-ink-600/35 dark:bg-ink-900/20"
          >
            <Plus className="h-6 w-6" />
            <span className="text-sm">Add another location</span>
          </button>
        </div>
      )}
    </div>
  );
}
