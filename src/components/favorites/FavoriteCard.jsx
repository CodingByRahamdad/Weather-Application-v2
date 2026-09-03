import { Star, Trash2 } from "lucide-react";
import { Card } from "../common/Card";
import { WeatherIcon } from "../weather/WeatherIcon";
import { useApp } from "../../context/AppContext";
import { convertTemperature, convertWind, unitSymbol, windUnitLabel } from "../../utils/format";
import { describeWeather } from "../../utils/weatherCodes";
import { cn } from "../../utils/cn";
import { Skeleton } from "../common/Skeleton";

export function FavoriteCard({ location, bundle, loading, isCurrent, onSelect, onRemove }) {
  const { settings } = useApp();
  const current = bundle?.current;
  const today = bundle?.daily[0];

  const localTime = (() => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: bundle?.timezone,
      }).format(new Date());
    } catch {
      return "—";
    }
  })();

  return (
    <Card
      className={cn(
        "relative cursor-pointer",
        isCurrent && "border-accent-400/60 shadow-[0_0_0_1px] shadow-accent-400/30",
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="truncate text-lg font-medium text-ink-900 dark:text-ink-50">{location.name}</p>
          <p className="mt-0.5 truncate text-xs text-ink-500 dark:text-ink-300">
            {[location.country, bundle ? `${localTime} local` : null].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {isCurrent ? (
            <span className="rounded-md bg-accent-400/15 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-accent-500 dark:text-accent-300">
              Currently viewing
            </span>
          ) : null}
          <Star className="h-4 w-4 fill-warning text-warning" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label={`Remove ${location.name} from favorites`}
            className="rounded-md p-1 text-ink-400 hover:bg-error/10 hover:text-error"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        {loading || !current ? (
          <>
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          </>
        ) : (
          <>
            <WeatherIcon code={current.weatherCode} isDay={current.isDay} size="xl" />
            <div className="flex items-baseline gap-1">
              <p className="font-display text-5xl text-ink-900 dark:text-ink-50">
                {current.temperatureC !== null
                  ? Math.round(convertTemperature(current.temperatureC, settings.temperatureUnit) ?? 0)
                  : "—"}
              </p>
              <p className="text-sm text-ink-400">{unitSymbol(settings.temperatureUnit)}</p>
            </div>
          </>
        )}
      </div>

      {current ? (
        <>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">
            {describeWeather(current.weatherCode).label} · feels{" "}
            {current.apparentC !== null
              ? Math.round(convertTemperature(current.apparentC, settings.temperatureUnit) ?? 0) + "°"
              : "—"}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#E1E6ED]/60 pt-3 dark:border-ink-600/40">
            <MetricStat
              label="Hi / Lo"
              value={
                today && today.tempMaxC !== null && today.tempMinC !== null
                  ? `${Math.round(convertTemperature(today.tempMaxC, settings.temperatureUnit) ?? 0)}° / ${Math.round(
                      convertTemperature(today.tempMinC, settings.temperatureUnit) ?? 0,
                    )}°`
                  : "—"
              }
            />
            <MetricStat
              label="Wind"
              value={
                current.windSpeedKmh !== null
                  ? `${Math.round(convertWind(current.windSpeedKmh, settings.windUnit))} ${windUnitLabel(settings.windUnit)}`
                  : "—"
              }
            />
            <MetricStat
              label="Humidity"
              value={current.humidity !== null ? `${Math.round(current.humidity)}%` : "—"}
            />
          </div>
        </>
      ) : null}
    </Card>
  );
}

function MetricStat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-mono uppercase tracking-widest text-ink-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink-900 dark:text-ink-50">{value}</p>
    </div>
  );
}
