import { Compass, Globe } from "lucide-react";
import { Card } from "../common/Card";
import { useApp } from "../../context/AppContext";
import { convertTemperature, unitSymbol } from "../../utils/format";

export function LocationMetaCard({ bundle }) {
  const { settings } = useApp();
  const { location, current, timezone } = bundle;

  const localTime = (() => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timezone,
      }).format(new Date());
    } catch {
      return "—";
    }
  })();

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">Location</h3>
        <Globe className="h-4 w-4 text-accent-500" />
      </div>

      <svg viewBox="0 0 200 90" className="mt-4 w-full text-accent-400/60">
        <path
          d="M0 60 Q50 20 100 50 T200 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 4"
        />
        <path
          d="M0 75 Q60 40 120 70 T200 60"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
        <circle cx="120" cy="55" r="5" fill="#5eead4" />
        <circle cx="120" cy="55" r="10" fill="#5eead4" opacity="0.25" />
      </svg>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-50">
            {location.name}
            {location.countryCode
              ? `, ${location.countryCode.toUpperCase()}`
              : location.country
              ? `, ${location.country}`
              : ""}
          </p>
          <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-ink-400">
            <Compass className="h-3 w-3 text-sky-accent" />
            {location.latitude.toFixed(4)}° {location.latitude >= 0 ? "N" : "S"} ·{" "}
            {location.longitude.toFixed(4)}° {location.longitude >= 0 ? "E" : "W"}
          </p>
          <p className="mt-1 text-[11px] text-ink-400">Local time {localTime}</p>
        </div>
        <p className="font-display text-3xl text-ink-900 dark:text-ink-50">
          {current.temperatureC !== null
            ? `${Math.round(
                convertTemperature(current.temperatureC, settings.temperatureUnit) ?? 0,
              )}${unitSymbol(settings.temperatureUnit)}`
            : "—"}
        </p>
      </div>
    </Card>
  );
}
