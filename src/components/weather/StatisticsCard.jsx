import { Card } from "../common/Card";
import { useApp } from "../../context/AppContext";
import { calculateStats } from "../../utils/stats";
import {
  convertPrecip,
  convertTemperature,
  convertWind,
  precipUnitLabel,
  unitSymbol,
  windUnitLabel,
} from "../../utils/format";

export function StatisticsCard({ bundle }) {
  const { settings } = useApp();
  const stats = calculateStats(bundle.daily);

  const tempUnit = unitSymbol(settings.temperatureUnit);

  const rows = [
    [
      "High",
      stats.highTempC !== null
        ? `${Math.round(convertTemperature(stats.highTempC, settings.temperatureUnit) ?? 0)}${tempUnit}`
        : "—",
    ],
    [
      "Low",
      stats.lowTempC !== null
        ? `${Math.round(convertTemperature(stats.lowTempC, settings.temperatureUnit) ?? 0)}${tempUnit}`
        : "—",
    ],
    [
      "Average",
      stats.avgTempC !== null
        ? `${Math.round(convertTemperature(stats.avgTempC, settings.temperatureUnit) ?? 0)}${tempUnit}`
        : "—",
    ],
    [
      "Total precip.",
      `${convertPrecip(stats.totalPrecipMm, settings.precipUnit).toFixed(
        settings.precipUnit === "inch" ? 2 : 1,
      )} ${precipUnitLabel(settings.precipUnit)}`,
    ],
    [
      "Max wind",
      `${Math.round(convertWind(stats.maxWindKmh, settings.windUnit))} ${windUnitLabel(settings.windUnit)}`,
    ],
    ["Rainy days", `${stats.rainyDays} / ${stats.daysAnalysed}`],
  ];

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">Weekly statistics</h3>
        <p className="text-xs text-ink-400">{stats.daysAnalysed}-day window</p>
      </div>
      <dl className="mt-auto grid grid-cols-2 gap-2 pt-4">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="rounded-[17px] border border-[#E1E6ED]/42 bg-white/40 p-3 dark:border-ink-600/28 dark:bg-ink-800/35"
          >
            <dt className="text-[10px] font-mono uppercase tracking-widest text-ink-400">{label}</dt>
            <dd className="mt-1 font-display text-lg text-ink-900 dark:text-ink-50">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
