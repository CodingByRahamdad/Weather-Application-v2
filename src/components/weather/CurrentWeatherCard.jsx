import { Droplets, Link2, MapPin, RotateCw, Star, Wind } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card } from "../common/Card";
import { WeatherIcon } from "./WeatherIcon";
import {
  degreesToCompass,
  formatTemp,
  formatWind,
  relativeFromNow,
  unitSymbol,
  windUnitLabel,
} from "../../utils/format";
import { describeWeather } from "../../utils/weatherCodes";
import { cn } from "../../utils/cn";

export function CurrentWeatherCard({ bundle, onRefresh, refreshing = false }) {
  const { settings, isFavorite, addFavorite, removeFavorite, toast } = useApp();
  const { location, current } = bundle;
  const fav = isFavorite(location.id);
  const desc = describeWeather(current.weatherCode);

  const airQuality = bundle.airQuality ?? { value: null, category: "Unavailable", tone: "muted" };

  const toggleFav = () => {
    if (fav) {
      removeFavorite(location.id);
      toast({ kind: "info", title: "Removed from favorites" });
    } else {
      addFavorite(location);
      toast({ kind: "success", title: "Added to favorites", message: location.name });
    }
  };

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/weather?lat=${location.latitude}&lon=${location.longitude}&name=${encodeURIComponent(location.name)}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ kind: "success", title: "Link copied" });
    } catch {
      toast({ kind: "error", title: "Could not copy link" });
    }
  };

  return (
    /* Cool-white gradient: #FFFFFF â†’ #EEF2F8, visible but still premium. */
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-[#EEF2F8] dark:from-transparent dark:to-transparent dark:bg-ink-900/80">
      {/* â”€â”€ Top row: location label + action buttons â”€â”€ */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {/* "CURRENTLY IN" label */}
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-ink-400">
            <MapPin className="h-3.5 w-3.5 text-accent-500" />
            Currently in
          </div>
          {/* City name + region */}
          <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2 className="font-display text-4xl leading-none text-ink-900 dark:text-ink-50 sm:text-5xl">
              {location.name}
            </h2>
            <p className="text-sm text-ink-500 dark:text-ink-300">
              {[location.admin1, location.country].filter(Boolean).join(" Â· ") || "â€”"}
            </p>
          </div>
        </div>

        {/* Icon buttons â€” white rounded squares with grey icon, matching reference */}
        <div className="flex items-center gap-1.5">
          <IconButton onClick={toggleFav} label={fav ? "Remove favorite" : "Add favorite"} active={fav}>
            <Star
              className={cn(
                "h-4 w-4 transition-colors",
                fav ? "fill-warning text-warning" : "text-ink-400 dark:text-ink-300",
              )}
            />
          </IconButton>
          <IconButton onClick={onRefresh} label="Refresh" active={refreshing}>
            <RotateCw
              className={cn(
                "h-4 w-4 text-accent-500 transition-transform dark:text-accent-300",
                refreshing && "animate-spin",
              )}
            />
          </IconButton>
          <IconButton onClick={copyLink} label="Copy link">
            <Link2 className="h-4 w-4 text-sky-accent" />
          </IconButton>
        </div>
      </div>

      {/* â”€â”€ Temperature + weather condition â”€â”€ */}
      <div className="mt-6 flex flex-wrap items-start gap-x-8 gap-y-4">
        <div className="flex items-baseline gap-1">
          <p className="font-display text-7xl leading-none text-ink-900 dark:text-ink-50 sm:text-8xl">
            {formatTemp(current.temperatureC, settings.temperatureUnit).replace("Â°", "")}
          </p>
          <p className="text-xl text-ink-400 dark:text-ink-400">
            {unitSymbol(settings.temperatureUnit)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <WeatherIcon code={current.weatherCode} isDay={current.isDay} size="xl" />
          <div>
            <p className="text-lg font-semibold text-ink-900 dark:text-ink-50">{desc.label}</p>
            <p className="text-sm text-ink-500 dark:text-ink-300">
              Feels like{" "}
              {formatTemp(current.apparentC, settings.temperatureUnit)}
              {unitSymbol(settings.temperatureUnit).replace("Â°", "")}
            </p>
          </div>
        </div>
      </div>

      {/* â”€â”€ Bottom row: chips, updated badge, AQI â”€â”€ */}
      <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
        {/* Wind â€” plain icon + text, no pill border */}
        <PlainChip>
          <Wind className="h-3.5 w-3.5 text-accent-500 dark:text-accent-300" />
          <span>
            {formatWind(current.windSpeedKmh, settings.windUnit)}{" "}
            {windUnitLabel(settings.windUnit)}{" "}
            {degreesToCompass(current.windDirectionDeg)}
          </span>
        </PlainChip>

        {/* Humidity â€” plain icon + text */}
        <PlainChip>
          <Droplets className="h-3.5 w-3.5 text-sky-accent" />
          <span>{current.humidity ?? "â€”"}%</span>
        </PlainChip>

        <div className="ml-auto flex items-center gap-4">
          {/* Updated timestamp â€” teal dot + grey text */}
          <div className="flex items-center gap-1.5 text-xs text-ink-400 dark:text-ink-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-400" />
            Updated {relativeFromNow(bundle.fetchedAt)}
          </div>

          {/* Air quality tile */}
          <div className="rounded-[17px] bg-white/45 px-3 py-2 text-right ring-1 ring-[#E1E6ED]/25 dark:bg-ink-800/45 dark:ring-ink-600/20">
            <p className="text-[10px] font-mono uppercase tracking-widest text-ink-400">
              Air quality
            </p>
            <p className="mt-0.5 text-lg font-semibold text-ink-900 dark:text-ink-50">
              {airQuality.value ?? "—"}{" "}
              <span
                className={cn(
                  "ml-1 text-[11px] font-medium",
                  airQuality.tone === "success" && "text-success",
                  airQuality.tone === "warning" && "text-warning",
                  airQuality.tone === "danger" && "text-danger",
                  airQuality.tone === "muted" && "text-ink-400",
                )}
              >
                {airQuality.category}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* Plain label â€” icon + text, no border, no background pill */
function PlainChip({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-ink-600 dark:text-ink-200">
      {children}
    </span>
  );
}

/* Soft rounded icon button */
function IconButton({ children, onClick, label, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-[16px]",
        "bg-white/80 transition-colors hover:bg-white",
        "shadow-[0_2px_8px_-2px_rgba(11,15,20,0.06)]",
        "border border-[#E1E6ED]/42",
        "dark:bg-ink-800/60 dark:hover:bg-ink-700 dark:border-ink-600/30",
        active && "border-accent-400/40 bg-accent-400/5 dark:border-accent-400/30 dark:bg-accent-400/5",
      )}
    >
      {children}
    </button>
  );
}
