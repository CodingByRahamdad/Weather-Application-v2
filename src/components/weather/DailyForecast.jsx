import { useMemo, useState } from "react";
import { ArrowUpDown, Droplets } from "lucide-react";
import { Card } from "../common/Card";
import { WeatherIcon } from "./WeatherIcon";
import { formatShortDate, formatShortDay, formatTemp } from "../../utils/format";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";

const RANGE_OPTIONS = [3, 5, 7];

export function DailyForecast({ bundle }) {
  const { settings } = useApp();
  const [range, setRange] = useState(settings.forecastRange);
  const [sort, setSort] = useState("date");

  const days = useMemo(() => {
    const copy = [...bundle.daily.slice(0, range)];
    switch (sort) {
      case "highTemp":
        copy.sort((a, b) => (b.tempMaxC ?? -Infinity) - (a.tempMaxC ?? -Infinity));
        break;
      case "lowTemp":
        copy.sort((a, b) => (a.tempMinC ?? Infinity) - (b.tempMinC ?? Infinity));
        break;
      case "precip":
        copy.sort((a, b) => (b.precipMm ?? 0) - (a.precipMm ?? 0));
        break;
      case "wind":
        copy.sort((a, b) => (b.windMaxKmh ?? 0) - (a.windMaxKmh ?? 0));
        break;
      default:
        copy.sort((a, b) => a.date.localeCompare(b.date));
    }
    return copy;
  }, [bundle.daily, range, sort]);

  return (
    <Card>
      <div className="flex flex-col gap-3">
        <h3 className="shrink-0 text-base font-semibold text-ink-900 dark:text-ink-50">
          Daily forecast
        </h3>

        {/* Controls scroll horizontally (thin scrollbar) on tight screens. */}
        <div className="thin-scrollbar flex w-full min-w-0 items-center gap-2 overflow-x-auto pb-1">
          <div
            role="group"
            aria-label="Forecast range"
            className="flex shrink-0 items-center gap-0.5 rounded-[12px] border border-[#E1E6ED]/45 bg-white/50 p-1 dark:border-ink-600/30 dark:bg-ink-800/50"
          >
            {RANGE_OPTIONS.map((n) => {
              const active = n === range;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRange(n)}
                  aria-pressed={active}
                  className={cn(
                    "shrink-0 rounded-[9px] px-2.5 py-1 text-xs font-medium transition-colors",
                    active
                      ? "bg-white text-ink-900 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:bg-ink-700 dark:text-ink-50"
                      : "text-ink-500 hover:text-ink-800 dark:text-ink-300 dark:hover:text-ink-50",
                  )}
                >
                  {n} Days
                </button>
              );
            })}
          </div>

          <label className="flex shrink-0 items-center gap-1 rounded-[12px] border border-[#E1E6ED]/45 bg-white/50 px-2 py-1.5 text-xs text-ink-500 dark:border-ink-600/30 dark:bg-ink-800/50 dark:text-ink-300">
            <ArrowUpDown className="h-3.5 w-3.5" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-xs outline-none"
              aria-label="Sort forecast"
            >
              <option value="date">By date</option>
              <option value="highTemp">Highest temp</option>
              <option value="lowTemp">Lowest temp</option>
              <option value="precip">Most rain</option>
              <option value="wind">Windiest</option>
            </select>
          </label>
        </div>
      </div>

      {days.length === 0 ? (
        <p className="mt-4 rounded-[18px] border border-dashed border-[#E1E6ED]/55 bg-white/25 py-6 text-center text-sm text-ink-500 dark:border-ink-600/35 dark:bg-ink-800/20 dark:text-ink-300">
          No forecast data available.
        </p>
      ) : (
        <div className="thin-scrollbar mt-3 flex-1 -mx-2 overflow-x-auto pb-2">
          <div className="flex h-full min-w-max gap-2 px-2">
            {days.map((d, i) => {
              const isToday = i === 0 && sort === "date";
              return (
                <div
                  key={d.date}
                  className={cn(
                    "flex h-full w-[92px] shrink-0 flex-col items-center justify-between rounded-[18px] border p-3 text-center transition-colors",
                    "border-[#E1E6ED]/42 bg-white/40 dark:border-ink-600/28 dark:bg-ink-800/35",
                    isToday && "border-accent-400/22",
                  )}
                >
                  <div>
                    <p className="text-xs font-medium text-ink-900 dark:text-ink-50">
                      {isToday ? "Today" : formatShortDay(d.date, bundle.timezone)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-ink-400">
                      {formatShortDate(d.date, bundle.timezone)}
                    </p>
                  </div>
                  <div className="py-1.5">
                    <WeatherIcon code={d.weatherCode} isDay size="md" />
                  </div>
                  <div>
                    <p className="text-xl font-medium leading-tight text-ink-900 dark:text-ink-50">
                      {formatTemp(d.tempMaxC, settings.temperatureUnit)}
                    </p>
                    <p className="text-xs text-ink-500 dark:text-ink-300">
                      {formatTemp(d.tempMinC, settings.temperatureUnit)}
                    </p>
                    <div className="mt-1.5 flex items-center justify-center gap-1 text-[10px] text-sky-accent">
                      <Droplets className="h-2.5 w-2.5" />
                      {Math.round(d.precipProbabilityMax ?? 0)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
