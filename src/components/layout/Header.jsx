import { Bell, Menu, Moon, Sun } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SearchBar } from "../search/SearchBar";
import { formatLongDate, greeting } from "../../utils/format";
import { cn } from "../../utils/cn";

export function Header({ onSelectLocation, onToggleSidebar }) {
  const { settings, updateSettings } = useApp();
  const themeIsDark =
    settings.theme === "dark" ||
    (settings.theme === "auto" && document.documentElement.classList.contains("dark"));

  // Shared theme toggle — rendered next to the search bar on small screens
  // and inside the right-hand control cluster on larger screens.
  const themeButton = (extra) => (
    <button
      type="button"
      onClick={() => updateSettings({ theme: themeIsDark ? "light" : "dark" })}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-ink-500 shadow-[0_1px_6px_-1px_rgba(11,15,20,0.06)] transition-colors hover:bg-white hover:text-ink-800 dark:bg-ink-800/80 dark:text-ink-300 dark:hover:bg-ink-700 dark:hover:text-ink-50",
        extra,
      )}
      aria-label={themeIsDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {themeIsDark ? (
        <Moon className="h-4 w-4 text-sky-accent" />
      ) : (
        <Sun className="h-4 w-4 text-warning" />
      )}
    </button>
  );

  return (
    /*
     * Light mode: very light grey-white background (matches reference screenshot).
     * Dark mode: deep ink background.
     */
    <header className="sticky top-0 z-30 bg-[#EFF2F7]/90 backdrop-blur-xl dark:border-b dark:border-ink-600/40 dark:bg-ink-950/90">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6">

        {/* Mobile-only hamburger — the desktop collapse control lives inside the sidebar */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="shrink-0 rounded-[16px] border border-[#E1E6ED]/45 bg-white/80 p-2 text-ink-500 shadow-[0_4px_18px_-10px_rgba(11,15,20,0.12)] transition-colors hover:bg-white dark:border-ink-600/30 dark:bg-ink-800/70 dark:text-ink-300 dark:hover:bg-ink-700 lg:hidden"
          aria-label="Open menu"
          aria-controls="app-sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Date + greeting — desktop only */}
        <div className="hidden min-w-0 flex-col lg:flex">
          <p className="text-xs text-ink-400 dark:text-ink-400">{formatLongDate()}</p>
          <h1 className="font-display text-lg leading-tight text-ink-900 dark:text-ink-50 sm:text-xl">
            {greeting()}, Amelia
          </h1>
        </div>

        {/* Search + mobile theme toggle */}
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:ml-4">
          <div className="min-w-0 flex-1">
            <SearchBar onSelect={onSelectLocation} />
          </div>
          {themeButton("sm:hidden")}
        </div>

        {/* Right-side controls */}
        <div className="hidden items-center gap-2 sm:flex">

          {/* °C / °F — active option is a solid teal pill; inactive is plain text */}
          <div
            role="group"
            aria-label="Temperature unit"
            className="flex items-center gap-0.5 rounded-full bg-white/90 px-1 py-1 shadow-[0_1px_6px_-1px_rgba(11,15,20,0.06)] dark:bg-ink-800/80"
          >
            <button
              type="button"
              onClick={() => updateSettings({ temperatureUnit: "celsius" })}
              aria-pressed={settings.temperatureUnit === "celsius"}
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                settings.temperatureUnit === "celsius"
                  ? "bg-accent-400 text-ink-950 shadow-sm"
                  : "text-ink-500 hover:text-ink-800 dark:text-ink-300 dark:hover:text-ink-50",
              )}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ temperatureUnit: "fahrenheit" })}
              aria-pressed={settings.temperatureUnit === "fahrenheit"}
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium transition-colors",
                settings.temperatureUnit === "fahrenheit"
                  ? "bg-accent-400 text-ink-950 shadow-sm"
                  : "text-ink-500 hover:text-ink-800 dark:text-ink-300 dark:hover:text-ink-50",
              )}
            >
              °F
            </button>
          </div>

          {/* Theme toggle — desktop */}
          {themeButton("hidden sm:flex")}

          {/* Bell — plain icon button */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-500 shadow-[0_1px_6px_-1px_rgba(11,15,20,0.06)] transition-colors hover:bg-white hover:text-ink-800 dark:bg-ink-800/80 dark:text-ink-300 dark:hover:bg-ink-700 dark:hover:text-ink-50"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
