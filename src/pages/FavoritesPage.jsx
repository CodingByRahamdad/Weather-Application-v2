import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, LayoutGrid, Loader2, MapPin, Plus, Search, Star, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { FavoriteCard } from "../components/favorites/FavoriteCard";
import { useFavoriteWeather } from "../hooks/useFavoriteWeather";
import { useLocationSearch } from "../hooks/useLocationSearch";
import { EmptyState } from "../components/common/EmptyState";
import { Button } from "../components/common/Button";
import { cn } from "../utils/cn";
import { MAX_FAVORITES } from "../utils/favorites";

export function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, selectedLocation, selectLocation, removeFavorite, addFavorite, isFavorite, toast } = useApp();
  const [sort, setSort] = useState("added");
  const [view, setView] = useState("grid");
  const [addCityOpen, setAddCityOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const searchPanelRef = useRef(null);
  const inputRef = useRef(null);

  const { results, loading, error } = useLocationSearch(query);

  const bundles = useFavoriteWeather(favorites);

  useEffect(() => {
    if (!addCityOpen) return;
    inputRef.current?.focus();
  }, [addCityOpen]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setAddCityOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const closeAddCity = () => {
    setAddCityOpen(false);
    setQuery("");
    setActiveIdx(0);
  };

  const openAddCity = () => setAddCityOpen(true);

  const handleAddCity = (location) => {
    if (isFavorite(location.id)) {
      toast({ kind: "info", title: "Already in favorites", message: location.name });
      return;
    }
    if (favorites.length >= MAX_FAVORITES) {
      toast({
        kind: "error",
        title: "Favorites limit reached",
        message: `You can save up to ${MAX_FAVORITES} favorites.`,
      });
      return;
    }
    addFavorite(location);
    toast({ kind: "success", title: "Added to favorites", message: location.name });
    closeAddCity();
  };

  const onSearchKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIdx((index) => Math.min(results.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIdx((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (results[activeIdx]) handleAddCity(results[activeIdx]);
    }
  };

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
          onClick={openAddCity}
        >
          Add a city
        </Button>
      </div>

      {addCityOpen ? (
        <div ref={searchPanelRef} className="relative z-20 rounded-[24px] border border-[#E1E6ED]/45 bg-white/70 p-4 shadow-[0_12px_42px_-22px_rgba(11,15,20,0.2)] backdrop-blur-xl dark:border-ink-600/30 dark:bg-ink-900/70">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[11px] font-mono uppercase tracking-widest text-ink-400">Add a favorite</p>
            <button
              type="button"
              onClick={closeAddCity}
              aria-label="Close add city search"
              className="rounded-[12px] p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-ink-800 dark:hover:text-ink-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              if (results[activeIdx]) handleAddCity(results[activeIdx]);
            }}
            className="flex items-center gap-2.5 rounded-full border border-accent-400/50 bg-white/90 px-4 py-2 shadow-[0_0_0_3px] shadow-accent-400/8 backdrop-blur-sm dark:bg-ink-900/80"
          >
            <button type="submit" aria-label="Search" className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-100">
              <Search className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIdx(0);
              }}
              onKeyDown={onSearchKeyDown}
              placeholder="Search city or postcode"
              aria-label="Search location to add"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:text-ink-50"
            />
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-ink-400" /> : query ? (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-100">
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </form>

          <div role="listbox" aria-label="Location results" className="mt-2 max-h-80 overflow-auto rounded-[22px] border border-[#E1E6ED]/45 bg-white/92 p-2 dark:border-ink-600/30 dark:bg-ink-800/92">
            {error ? <p className="px-3 py-3 text-sm text-error">{error}</p> : null}
            {loading && !results.length ? (
              <div className="space-y-2 p-2">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex items-center gap-3 rounded-lg p-2">
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-ink-200 dark:bg-ink-700" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-1/3 animate-pulse rounded bg-ink-200 dark:bg-ink-700" />
                      <div className="h-2.5 w-2/3 animate-pulse rounded bg-ink-200/70 dark:bg-ink-700/70" />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {!loading && !error && query.trim().length >= 2 && results.length === 0 ? (
              <p className="px-3 py-4 text-sm text-ink-500 dark:text-ink-300">No matches for &ldquo;{query}&rdquo;. Try a different name.</p>
            ) : null}
            {!loading && results.length > 0 ? (
              <ul>
                {results.map((result, index) => (
                  <li key={result.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={index === activeIdx}
                      onMouseEnter={() => setActiveIdx(index)}
                      onClick={() => handleAddCity(result)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition-colors",
                        index === activeIdx
                          ? "bg-accent-400/10 text-ink-900 dark:text-ink-50"
                          : "text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-700/50",
                      )}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{result.name}</p>
                        <p className="truncate text-xs text-ink-400">{[result.admin1, result.country].filter(Boolean).join(" · ") || `${result.latitude.toFixed(2)}, ${result.longitude.toFixed(2)}`}</p>
                      </div>
                      {result.countryCode ? <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-mono uppercase text-ink-500 dark:bg-ink-700 dark:text-ink-300">{result.countryCode}</span> : null}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      {favorites.length === 0 ? (
        <EmptyState
          icon={<Star className="h-10 w-10 text-warning" />}
          title="No favorites yet"
          description="Save cities you check often. They'll appear here with a live snapshot."
          action={<Button variant="primary" onClick={openAddCity}>Find a city</Button>}
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
            onClick={openAddCity}
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
