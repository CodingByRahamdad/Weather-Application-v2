import { Cloud, Droplets, Eye, Gauge, Sun, Thermometer, Wind } from "lucide-react";
import { Card } from "../common/Card";
import { useApp } from "../../context/AppContext";
import {
  convertPrecip,
  convertTemperature,
  degreesToCompass,
  formatWind,
  precipUnitLabel,
  relativeFromNow,
  windUnitLabel,
} from "../../utils/format";

export function WeatherDetails({ bundle }) {
  const { settings } = useApp();
  const c = bundle.current;

  const feelsDelta =
    c.apparentC !== null && c.temperatureC !== null
      ? Math.round(c.apparentC - c.temperatureC)
      : null;

  const items = [
    {
      icon: <Thermometer className="h-3.5 w-3.5 text-warning" />,
      label: "Feels like",
      value:
        c.apparentC !== null
          ? `${Math.round(convertTemperature(c.apparentC, settings.temperatureUnit) ?? 0)}°`
          : "—",
      sub:
        feelsDelta === null
          ? undefined
          : feelsDelta === 0
          ? "same as actual"
          : feelsDelta > 0
          ? `${Math.abs(feelsDelta)}° warmer`
          : `${Math.abs(feelsDelta)}° cooler`,
    },
    {
      icon: <Droplets className="h-3.5 w-3.5 text-sky-accent" />,
      label: "Humidity",
      value: c.humidity !== null ? `${Math.round(c.humidity)}%` : "—",
      sub:
        c.humidity !== null
          ? c.humidity < 30
            ? "Dry"
            : c.humidity < 60
            ? "Comfortable"
            : "Humid"
          : undefined,
    },
    {
      icon: <Wind className="h-3.5 w-3.5 text-accent-500" />,
      label: "Wind",
      value: `${formatWind(c.windSpeedKmh, settings.windUnit)} ${windUnitLabel(settings.windUnit)}`,
      sub: `Direction ${degreesToCompass(c.windDirectionDeg)}`,
    },
    {
      icon: <Eye className="h-3.5 w-3.5 text-sky-accent" />,
      label: "Visibility",
      value: c.visibilityKm !== null ? `${Math.round(c.visibilityKm)} km` : "—",
      sub:
        c.visibilityKm !== null
          ? c.visibilityKm >= 10
            ? "Excellent"
            : c.visibilityKm >= 5
            ? "Good"
            : "Reduced"
          : undefined,
    },
    {
      icon: <Gauge className="h-3.5 w-3.5 text-accent-600" />,
      label: "Pressure",
      value: c.pressureHpa !== null ? `${Math.round(c.pressureHpa)} hPa` : "—",
      sub: "Steady",
    },
    {
      icon: <Cloud className="h-3.5 w-3.5 text-[#7f9fc0]" />,
      label: "Cloud cover",
      value: c.cloudCover !== null ? `${Math.round(c.cloudCover)}%` : "—",
      sub:
        c.cloudCover !== null
          ? c.cloudCover < 25
            ? "Mostly clear"
            : c.cloudCover < 60
            ? "Scattered clouds"
            : "Overcast"
          : undefined,
    },
    {
      icon: <Sun className="h-3.5 w-3.5 text-warning" />,
      label: "UV index",
      value: c.uvIndex !== null ? `${Math.round(c.uvIndex)}` : "—",
      sub:
        c.uvIndex !== null
          ? c.uvIndex < 3
            ? "Low"
            : c.uvIndex < 6
            ? "Moderate"
            : c.uvIndex < 8
            ? "High"
            : "Very high"
          : undefined,
    },
    {
      icon: <Droplets className="h-3.5 w-3.5 text-sky-accent" />,
      label: "Precipitation",
      value:
        c.precipitationMm !== null
          ? `${convertPrecip(c.precipitationMm, settings.precipUnit).toFixed(
              settings.precipUnit === "inch" ? 2 : 1,
            )} ${precipUnitLabel(settings.precipUnit)}`
          : "—",
      sub: "Last hour",
    },
  ];

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">Weather details</h3>
        <p className="text-xs text-ink-400">Last updated {relativeFromNow(bundle.fetchedAt)}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-[17px] border border-[#E1E6ED]/42 bg-white/40 p-3 dark:border-ink-600/28 dark:bg-ink-800/35"
          >
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-ink-400">
              <span>{item.label}</span>
              <span className="text-ink-500">{item.icon}</span>
            </div>
            <p className="mt-2 font-display text-2xl leading-none text-ink-900 dark:text-ink-50">
              {item.value}
            </p>
            {item.sub ? (
              <p className="mt-1 text-xs text-ink-500 dark:text-ink-300">{item.sub}</p>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
