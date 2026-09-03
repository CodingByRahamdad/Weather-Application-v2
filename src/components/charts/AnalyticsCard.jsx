import { useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Droplets, Thermometer, Wind } from "lucide-react";
import { Card } from "../common/Card";
import { useApp } from "../../context/AppContext";
import {
  convertPrecip,
  convertTemperature,
  convertWind,
  formatHour,
  precipUnitLabel,
  unitSymbol,
  windUnitLabel,
} from "../../utils/format";
import { cn } from "../../utils/cn";
import { useElementWidth } from "../../hooks/useElementWidth";

// "10 PM" -> "10p"  ·  "2 AM" -> "2a"   (used only on narrow charts)
function compactHour(label) {
  if (typeof label !== "string") return label;
  return label.replace(/\s*AM$/i, "a").replace(/\s*PM$/i, "p");
}

const CHART_MARGIN = { top: 10, right: 10, left: 0, bottom: 0 };

export function AnalyticsCard({ bundle, variant = "full" }) {
  const { settings } = useApp();
  const [metric, setMetric] = useState("temperature");
  const chartRef = useRef(null);
  const chartWidth = useElementWidth(chartRef);

  // Narrow charts get compact hour labels ("10p") and a slimmer value axis so
  // nothing is clipped at small widths.
  const isNarrow = chartWidth > 0 && chartWidth < 380;

  const xAxisProps = {
    tick: { fontSize: 10, fill: "#6d7785" },
    axisLine: false,
    tickLine: false,
    tickMargin: 8,
    height: 24,
    // Let Recharts drop colliding labels instead of forcing a fixed step,
    // and always keep the first/last so the range stays readable.
    interval: "preserveStartEnd",
    minTickGap: isNarrow ? 24 : 32,
    padding: { left: 6, right: 6 },
    tickFormatter: (value) => (isNarrow ? compactHour(value) : value),
  };

  const yAxisProps = {
    tick: { fontSize: 10, fill: "#6d7785" },
    axisLine: false,
    tickLine: false,
    tickMargin: 4,
    width: isNarrow ? 28 : 36,
  };

  const points = useMemo(() => {
    const now = Date.now();
    let start = bundle.hourly.findIndex(
      (h) => new Date(h.time).getTime() >= now - 60 * 60 * 1000,
    );
    if (start < 0) start = 0;
    const window = bundle.hourly.slice(start, start + 24);

    return window.map((h) => ({
      time: h.time,
      hour: formatHour(h.time, bundle.timezone),
      tempRaw: h.temperatureC,
      temp:
        h.temperatureC !== null
          ? Math.round((convertTemperature(h.temperatureC, settings.temperatureUnit) ?? 0) * 10) / 10
          : null,
      precip:
        h.precipMm !== null
          ? Number(convertPrecip(h.precipMm, settings.precipUnit).toFixed(2))
          : 0,
      wind:
        h.windSpeedKmh !== null
          ? Math.round(convertWind(h.windSpeedKmh, settings.windUnit))
          : 0,
    }));
  }, [bundle, settings]);

  const summary = useMemo(() => {
    const tempsC = bundle.hourly.slice(0, 24).map((h) => h.temperatureC).filter((v) => v !== null);
    const precipMm = bundle.hourly.slice(0, 24).reduce((s, h) => s + (h.precipMm ?? 0), 0);
    const windsKmh = bundle.hourly.slice(0, 24).map((h) => h.windSpeedKmh).filter((v) => v !== null);

    const avgTemp = tempsC.length ? tempsC.reduce((a, b) => a + b, 0) / tempsC.length : null;
    const maxWind = windsKmh.length ? Math.max(...windsKmh) : 0;
    const precipPct = Math.round(
      bundle.hourly.slice(0, 24).reduce((s, h) => s + (h.precipProbability ?? 0), 0) /
        Math.max(1, bundle.hourly.slice(0, 24).length),
    );
    return {
      avgTemp:
        avgTemp !== null
          ? `${Math.round(convertTemperature(avgTemp, settings.temperatureUnit) ?? 0)}${unitSymbol(settings.temperatureUnit)}`
          : "—",
      precipPct: `${precipPct}%`,
      totalPrecip: `${convertPrecip(precipMm, settings.precipUnit).toFixed(
        settings.precipUnit === "inch" ? 2 : 1,
      )} ${precipUnitLabel(settings.precipUnit)}`,
      maxWind: `${Math.round(convertWind(maxWind, settings.windUnit))} ${windUnitLabel(settings.windUnit)}`,
    };
  }, [bundle.hourly, settings]);

  return (
    <Card>
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-ink-900 dark:text-ink-50">Analytics</h3>
          <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-300">
            7-day trend · hourly resolution
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Chart metric"
          className="flex w-full items-center gap-0.5 rounded-[16px] border border-[#E1E6ED]/45 bg-white/50 p-1 lg:w-auto dark:border-ink-600/30 dark:bg-ink-800/50"
        >
          <TabButton active={metric === "temperature"} onClick={() => setMetric("temperature")}>
            <Thermometer className="h-3.5 w-3.5 shrink-0 text-warning" />
            <span className="hidden sm:inline">Temperature</span>
            <span className="sm:hidden">Temp</span>
          </TabButton>
          <TabButton active={metric === "precipitation"} onClick={() => setMetric("precipitation")}>
            <Droplets className="h-3.5 w-3.5 shrink-0 text-sky-accent" />
            <span>Precip</span>
          </TabButton>
          <TabButton active={metric === "wind"} onClick={() => setMetric("wind")}>
            <Wind className="h-3.5 w-3.5 shrink-0 text-accent-500" />
            <span>Wind</span>
          </TabButton>
        </div>
      </div>

      {variant === "full" ? (
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <SummaryTile icon={<Thermometer className="h-3.5 w-3.5 text-warning" />} label="Temperature" value={summary.avgTemp} sub="avg" />
          <SummaryTile icon={<Droplets className="h-3.5 w-3.5 text-sky-accent" />} label="Precipitation" value={summary.totalPrecip} sub={summary.precipPct + " chance"} />
          <SummaryTile icon={<Wind className="h-3.5 w-3.5 text-accent-500" />} label="Wind speed" value={summary.maxWind} sub="peak" />
        </div>
      ) : null}

      <div ref={chartRef} className="mt-4 h-52 w-full min-w-0 flex-1 sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          {metric === "temperature" ? (
            <AreaChart data={points} margin={CHART_MARGIN}>
              <defs>
                <linearGradient id="tempFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#5eead4" stopOpacity="0.5" />
                  <stop offset="1" stopColor="#5eead4" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" {...xAxisProps} />
              <YAxis {...yAxisProps} />
              <Tooltip cursor={{ stroke: "#5eead4", strokeOpacity: 0.35 }} content={<TipContent unit={unitSymbol(settings.temperatureUnit)} field="temp" />} />
              <Area type="monotone" dataKey="temp" stroke="#5eead4" strokeWidth={2} fill="url(#tempFill)" />
            </AreaChart>
          ) : metric === "precipitation" ? (
            <BarChart data={points} margin={CHART_MARGIN}>
              <XAxis dataKey="hour" {...xAxisProps} />
              <YAxis {...yAxisProps} />
              <Tooltip cursor={{ fill: "#60a5fa", fillOpacity: 0.08 }} content={<TipContent unit={precipUnitLabel(settings.precipUnit)} field="precip" />} />
              <Bar dataKey="precip" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={points} margin={CHART_MARGIN}>
              <XAxis dataKey="hour" {...xAxisProps} />
              <YAxis {...yAxisProps} />
              <Tooltip cursor={{ stroke: "#60a5fa", strokeOpacity: 0.35 }} content={<TipContent unit={windUnitLabel(settings.windUnit)} field="wind" />} />
              <Line type="monotone" dataKey="wind" stroke="#60a5fa" strokeWidth={2} dot={false} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex min-w-0 flex-1 items-center justify-center gap-1.5 truncate rounded-[12px] px-2 py-1.5 text-xs transition-colors lg:flex-none lg:px-2.5 lg:py-1",
        active
          ? "bg-white text-ink-900 shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:bg-ink-700 dark:text-ink-50"
          : "text-ink-500 hover:text-ink-800 dark:text-ink-300 dark:hover:text-ink-50",
      )}
    >
      {children}
    </button>
  );
}

function SummaryTile({ icon, label, value, sub }) {
  return (
    <div className="rounded-[17px] border border-[#E1E6ED]/42 bg-white/40 p-3 dark:border-ink-600/28 dark:bg-ink-800/35">
      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-ink-400">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-1.5 font-display text-xl leading-tight text-ink-900 dark:text-ink-50">{value}</p>
      {sub ? <p className="text-[11px] text-ink-500 dark:text-ink-300">{sub}</p> : null}
    </div>
  );
}

function TipContent({ active, payload, label, unit, field }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].payload[field];
  return (
    <div className="rounded-[16px] border border-[#E1E6ED]/45 bg-white/90 px-3 py-2 text-xs shadow-[0_10px_32px_-20px_rgba(11,15,20,0.22)] backdrop-blur-xl dark:border-ink-600/30 dark:bg-ink-800/90">
      <p className="text-ink-400">{label}</p>
      <p className="font-medium text-ink-900 dark:text-ink-50">
        {value ?? "—"} {unit}
      </p>
    </div>
  );
}
