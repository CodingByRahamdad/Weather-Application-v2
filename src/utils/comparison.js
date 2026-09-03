// Pure helper that turns two weather bundles into the rows shown by
// WeatherComparisonCard. Kept independent of React so it can be unit
// tested directly, the same pattern used for stats.js and favorites.js.

import { calculateStats } from "./stats";
import {
  convertPrecip,
  convertTemperature,
  convertWind,
  precipUnitLabel,
  unitSymbol,
  windUnitLabel,
} from "./format";

export function buildComparisonRows(leftBundle, rightBundle, settings) {
  const tempUnit = unitSymbol(settings.temperatureUnit);
  const windUnit = windUnitLabel(settings.windUnit);
  const precipUnit = precipUnitLabel(settings.precipUnit);

  const leftStats = leftBundle ? calculateStats(leftBundle.daily) : null;
  const rightStats = rightBundle ? calculateStats(rightBundle.daily) : null;

  const temp = (celsius) =>
    celsius === null || celsius === undefined
      ? "—"
      : `${Math.round(convertTemperature(celsius, settings.temperatureUnit) ?? 0)}${tempUnit}`;

  const wind = (kmh) =>
    kmh === null || kmh === undefined
      ? "—"
      : `${Math.round(convertWind(kmh, settings.windUnit))} ${windUnit}`;

  const precip = (mm) =>
    mm === null || mm === undefined
      ? "—"
      : `${convertPrecip(mm, settings.precipUnit).toFixed(settings.precipUnit === "inch" ? 2 : 1)} ${precipUnit}`;

  const humidity = (value) =>
    value === null || value === undefined ? "—" : `${Math.round(value)}%`;

  return [
    {
      label: "Feels like",
      leftValue: temp(leftBundle?.current?.apparentC),
      rightValue: temp(rightBundle?.current?.apparentC),
    },
    {
      label: "7-day high",
      leftValue: leftStats ? temp(leftStats.highTempC) : "—",
      rightValue: rightStats ? temp(rightStats.highTempC) : "—",
    },
    {
      label: "7-day low",
      leftValue: leftStats ? temp(leftStats.lowTempC) : "—",
      rightValue: rightStats ? temp(rightStats.lowTempC) : "—",
    },
    {
      label: "Total precip.",
      leftValue: leftStats ? precip(leftStats.totalPrecipMm) : "—",
      rightValue: rightStats ? precip(rightStats.totalPrecipMm) : "—",
    },
    {
      label: "Max wind",
      leftValue: leftStats ? wind(leftStats.maxWindKmh) : "—",
      rightValue: rightStats ? wind(rightStats.maxWindKmh) : "—",
    },
    {
      label: "Humidity",
      leftValue: humidity(leftBundle?.current?.humidity),
      rightValue: humidity(rightBundle?.current?.humidity),
    },
  ];
}
