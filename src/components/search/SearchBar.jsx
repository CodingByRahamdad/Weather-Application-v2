import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useLocationSearch } from "../../hooks/useLocationSearch";
import { cn } from "../../utils/cn";

export function SearchBar({ onSelect, compact }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const { results, loading, error } = useLocationSearch(query);
  const { history } = useApp();

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Global Cmd/Ctrl+K to focus search.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const showRecent = query.trim().length === 0 && history.length > 0;
  const list = showRecent ? history : results;

  const handleSelect = (loc) => {
    onSelect(loc);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(list.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    // Requirement: search must not execute / submit for an empty value.
    if (!trimmed && !showRecent) return;
    const chosen = list[activeIdx] ?? list[0];
    if (chosen) handleSelect(chosen);
  };

  return (
    <div ref={wrapRef} className={cn("relative w-full", compact ? "max-w-md" : "max-w-xl")}>
      <form
        role="search"
        onSubmit={onSubmit}
        className={cn(
          "flex items-center gap-2.5 rounded-full border bg-white/90 px-4 py-2 transition-colors backdrop-blur-sm",
          "dark:bg-ink-900/80",
          open
            ? "border-accent-400/50 shadow-[0_0_0_3px] shadow-accent-400/8"
            : "border-[#E1E6ED]/45 dark:border-ink-600/35",
        )}
      >
        <label htmlFor="location-search-input" className="sr-only">
          Search for a city
        </label>
        <button
          type="submit"
          aria-label="Search"
          className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-100"
        >
          <Search className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <input
          id="location-search-input"
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIdx(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search city or postcode"
          aria-label="Search location"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 outline-none dark:text-ink-50"
        />
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-ink-400" />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="text-ink-400 hover:text-ink-700 dark:hover:text-ink-100"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <kbd className="hidden rounded-[8px] border border-[#E1E6ED]/60 bg-white/70 px-1.5 py-0.5 text-[10px] font-mono text-ink-400 sm:inline-block dark:border-ink-600/40 dark:bg-ink-800">
            ⌘K
          </kbd>
        )}
      </form>

      {open ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 z-40 mt-2 max-h-96 overflow-auto rounded-[22px] border border-[#E1E6ED]/45 bg-white/92 p-2 shadow-[0_12px_42px_-22px_rgba(11,15,20,0.2)] backdrop-blur-xl dark:border-ink-600/30 dark:bg-ink-800/92"
        >
          {showRecent ? (
            <p className="px-3 py-2 text-[11px] font-mono uppercase tracking-widest text-ink-400">
              Recent searches
            </p>
          ) : null}

          {error ? <p className="px-3 py-3 text-sm text-error">{error}</p> : null}

          {loading && !list.length ? (
            <div className="space-y-2 p-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg p-2">
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-ink-200 dark:bg-ink-700" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-ink-200 dark:bg-ink-700" />
                    <div className="h-2.5 w-2/3 animate-pulse rounded bg-ink-200/70 dark:bg-ink-700/70" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!loading && !error && query.trim().length >= 2 && list.length === 0 ? (
            <p className="px-3 py-4 text-sm text-ink-500 dark:text-ink-300">
              No matches for &ldquo;{query}&rdquo;. Try a different name.
            </p>
          ) : null}

          {!loading && list.length > 0 ? (
            <ul>
              {list.map((r, i) => (
                <li key={r.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === activeIdx}
                    onMouseEnter={() => setActiveIdx(i)}
                    onClick={() => handleSelect(r)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left transition-colors",
                      i === activeIdx
                        ? "bg-accent-400/10 text-ink-900 dark:text-ink-50"
                        : "text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-700/50",
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="truncate text-xs text-ink-400">
                        {[r.admin1, r.country].filter(Boolean).join(" · ") ||
                          `${r.latitude.toFixed(2)}, ${r.longitude.toFixed(2)}`}
                      </p>
                    </div>
                    {r.countryCode ? (
                      <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-mono uppercase text-ink-500 dark:bg-ink-700 dark:text-ink-300">
                        {r.countryCode}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
