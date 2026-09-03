import { useMemo, useState } from "react";
import { Droplets } from "lucide-react";
import { Card } from "../common/Card";
import { WeatherIcon } from "./WeatherIcon";
import { formatHour, formatTemp } from "../../utils/format";
import { useApp } from "../../context/AppContext";
import { cn } from "../../utils/cn";

export function HourlyForecast({ bundle }) {
  const { settings } = useApp();
  const { hourly, daily, timezone } = bundle;

  const dayTabs = useMemo(
    () =>
      daily.slice(0, 3).map((d, i) => ({
        date: d.date,
        label:
          i === 0
            ? "Today"
            : i === 1
            ? "Tomorrow"
            : new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(
                new Date(d.date + "T12:00:00"),
              ),
      })),
    [daily],
  );

  const [activeDate, setActiveDate] = useState(dayTabs[0]?.date ?? "");

  const items = useMemo(() => {
    if (!hourly.length) return [];
    const now = Date.now();
    const target = activeDate || dayTabs[0]?.date;
    const dayItems = hourly.filter((h) => h.time.startsWith(target));
    if (!target || target === dayTabs[0]?.date) {
      let startIdx = dayItems.findIndex(
        (h) => new Date(h.time).getTime() >= now - 30 * 60 * 1000,
      );
      if (startIdx < 0) startIdx = 0;
      return dayItems.slice(startIdx, startIdx + 10);
    }
    return dayItems.slice(6, 16);
  }, [hourly, activeDate, dayTabs]);

  const nextPrecip = items.find((h) => (h.precipProbability ?? 0) >= 40);

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">Hourly forecast</h3>
          <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-300">
            Next 12 hours
            {nextPrecip ? ` · Precipitation likely at ${formatHour(nextPrecip.time, timezone)}` : ""}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Forecast day"
          className="flex w-full items-center gap-0.5 rounded-[16px] border border-[#E1E6ED]/45 bg-white/50 p-1 sm:w-auto dark:border-ink-600/30 dark:bg-ink-800/50"
        >
          {dayTabs.map((t) => (
            <button
              key={t.date}
              type="button"
              role="tab"
              aria-selected={t.date === activeDate}
              onClick={() => setActiveDate(t.date)}
              className={cn(
                "flex min-w-0 flex-1 items-center justify-center truncate rounded-[12px] px-2 py-1.5 text-xs font-medium transition-colors sm:min-w-[64px] sm:flex-none sm:px-3 sm:py-1",
                t.date === activeDate
                  ? "bg-white text-ink-900 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:bg-ink-700 dark:text-ink-50"
                  : "text-ink-500 hover:text-ink-800 dark:text-ink-300 dark:hover:text-ink-50",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="thin-scrollbar mt-auto -mx-2 overflow-x-auto overflow-y-hidden px-0 pb-2 pt-6">
        <div className="flex min-w-max gap-2 px-2">
          {items.map((h, i) => {
            const isNow = i === 0 && (activeDate === dayTabs[0]?.date || !activeDate);
            const emphasize = i === 3;
            return (
              <div
                key={h.time}
                className={cn(
                  "flex w-[68px] shrink-0 flex-col items-center rounded-[18px] border px-2 py-3 text-center transition-colors sm:w-[76px]",
                  emphasize
                    ? "border-accent-400/22 bg-accent-400/8"
                    : "border-[#E1E6ED]/42 bg-white/40 dark:border-ink-600/28 dark:bg-ink-800/35",
                )}
              >
                <p
                  className={cn(
                    "text-[10px] font-mono uppercase tracking-widest",
                    emphasize ? "text-accent-500 dark:text-accent-300" : "text-ink-400",
                  )}
                >
                  {isNow ? "Now" : formatHour(h.time, timezone)}
                </p>
                <div className="mt-2">
                  <WeatherIcon code={h.weatherCode} isDay={h.isDay} size="sm" />
                </div>
                <p className="mt-2 text-lg font-medium text-ink-900 dark:text-ink-50">
                  {formatTemp(h.temperatureC, settings.temperatureUnit)}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-sky-accent">
                  <Droplets className="h-2.5 w-2.5" />
                  {Math.round(h.precipProbability ?? 0)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
