import { useMemo, useState } from "react";
import { Scale } from "lucide-react";
import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";
import { WeatherIcon } from "./WeatherIcon";
import { useApp } from "../../context/AppContext";
import { useFavoriteWeather } from "../../hooks/useFavoriteWeather";
import { describeWeather } from "../../utils/weatherCodes";
import { buildComparisonRows } from "../../utils/comparison";
import { convertTemperature, unitSymbol } from "../../utils/format";

// Bonus/optional feature: lets the user pick two saved favorites and see
// their current + weekly figures side by side. Data always comes straight
// from the same weather service used everywhere else in the app — nothing
// here is hardcoded.
export function WeatherComparisonCard() {
  const { favorites, settings } = useApp();
  const [leftId, setLeftId] = useState(favorites[0]?.id ?? "");
  const [rightId, setRightId] = useState(favorites[1]?.id ?? "");

  const selected = useMemo(
    () => favorites.filter((f) => f.id === leftId || f.id === rightId),
    [favorites, leftId, rightId],
  );

  const weatherMap = useFavoriteWeather(selected);

  const left = favorites.find((f) => f.id === leftId) ?? null;
  const right = favorites.find((f) => f.id === rightId) ?? null;

  if (favorites.length < 2) {
    return (
      <Card>
        <Header />
        <p className="mt-4 text-sm text-ink-500 dark:text-ink-300">
          Save at least two favorite locations to compare them here. You have{" "}
          {favorites.length} saved right now.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <Header />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <LocationPicker
          label="City A"
          value={leftId}
          onChange={setLeftId}
          favorites={favorites}
          excludeId={rightId}
        />
        <LocationPicker
          label="City B"
          value={rightId}
          onChange={setRightId}
          favorites={favorites}
          excludeId={leftId}
        />
      </div>

      {left && right && leftId === rightId ? (
        <p className="mt-4 text-sm text-ink-500 dark:text-ink-300">
          Pick two different locations to compare.
        </p>
      ) : left && right ? (
        <ComparisonBody
          left={left}
          right={right}
          leftState={weatherMap[left.id]}
          rightState={weatherMap[right.id]}
          settings={settings}
        />
      ) : (
        <p className="mt-4 text-sm text-ink-500 dark:text-ink-300">
          Choose two favorites above to see them side by side.
        </p>
      )}
    </Card>
  );
}

function Header() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Scale className="h-4 w-4 text-accent-500" strokeWidth={1.75} />
        <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">
          Compare favorites
        </h3>
      </div>
      <p className="text-xs text-ink-400">Current + 7-day figures</p>
    </div>
  );
}

function LocationPicker({ label, value, onChange, favorites, excludeId }) {
  return (
    <label className="block">
      <span className="text-[11px] font-mono uppercase tracking-widest text-ink-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-[14px] border border-[#E1E6ED]/55 bg-white/70 px-3 py-2 text-sm text-ink-900 outline-none focus-visible:border-accent-400/60 dark:border-ink-600/40 dark:bg-ink-800/60 dark:text-ink-50"
      >
        <option value="" disabled>
          Select a favorite
        </option>
        {favorites.map((f) => (
          <option key={f.id} value={f.id} disabled={f.id === excludeId}>
            {f.name}
            {f.country ? `, ${f.country}` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}

function ComparisonBody({ left, right, leftState, rightState, settings }) {
  const loading = leftState?.loading || rightState?.loading;
  const error = leftState?.error || rightState?.error;

  if (error && !leftState?.bundle && !rightState?.bundle) {
    return (
      <p className="mt-4 text-sm text-error">
        Couldn&apos;t load weather for one of the selected cities. Try again.
      </p>
    );
  }

  if (loading && !leftState?.bundle && !rightState?.bundle) {
    return (
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  const leftBundle = leftState?.bundle;
  const rightBundle = rightState?.bundle;

  const rows = buildComparisonRows(leftBundle, rightBundle, settings);

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-3">
        <CityHeader location={left} bundle={leftBundle} settings={settings} />
        <CityHeader location={right} bundle={rightBundle} settings={settings} />
      </div>

      <dl className="mt-4 divide-y divide-[#E1E6ED]/50 dark:divide-ink-600/30">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2.5"
          >
            <dd className="text-right text-sm font-medium text-ink-900 dark:text-ink-50">
              {row.leftValue}
            </dd>
            <dt className="text-center text-[10px] font-mono uppercase tracking-widest text-ink-400">
              {row.label}
            </dt>
            <dd className="text-left text-sm font-medium text-ink-900 dark:text-ink-50">
              {row.rightValue}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CityHeader({ location, bundle, settings }) {
  const tempUnit = unitSymbol(settings.temperatureUnit);
  const current = bundle?.current;
  const weather = current ? describeWeather(current.weatherCode) : null;

  return (
    <div className="rounded-[17px] border border-[#E1E6ED]/42 bg-white/40 p-3 text-center dark:border-ink-600/28 dark:bg-ink-800/35">
      <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-50">
        {location.name}
      </p>
      <p className="truncate text-xs text-ink-400">{location.country ?? "—"}</p>
      {current ? (
        <>
          <div className="mt-2 flex items-center justify-center gap-2">
            <WeatherIcon code={current.weatherCode} isDay={current.isDay} size="md" />
            <span className="font-display text-2xl text-ink-900 dark:text-ink-50">
              {Math.round(convertTemperature(current.temperatureC, settings.temperatureUnit) ?? 0)}
              {tempUnit}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-400">{weather?.label}</p>
        </>
      ) : (
        <Skeleton className="mx-auto mt-2 h-10 w-16" />
      )}
    </div>
  );
}

