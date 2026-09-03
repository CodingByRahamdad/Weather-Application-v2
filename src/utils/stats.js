import { isRainy } from "./weatherCodes";

export function calculateStats(days) {
  if (!days.length) {
    return {
      highTempC: null,
      lowTempC: null,
      avgTempC: null,
      totalPrecipMm: 0,
      maxWindKmh: 0,
      rainyDays: 0,
      daysAnalysed: 0,
    };
  }

  const highs = days.map((d) => d.tempMaxC).filter((v) => v !== null);
  const lows = days.map((d) => d.tempMinC).filter((v) => v !== null);
  const avgs = days
    .map((d) => (d.tempMaxC !== null && d.tempMinC !== null ? (d.tempMaxC + d.tempMinC) / 2 : null))
    .filter((v) => v !== null);

  const totalPrecipMm = days.reduce((sum, d) => sum + (d.precipMm ?? 0), 0);
  const maxWindKmh = days.reduce((max, d) => Math.max(max, d.windMaxKmh ?? 0), 0);
  const rainyDays = days.filter((d) => isRainy(d.weatherCode) || (d.precipMm ?? 0) > 0.2).length;

  return {
    highTempC: highs.length ? Math.max(...highs) : null,
    lowTempC: lows.length ? Math.min(...lows) : null,
    avgTempC: avgs.length ? avgs.reduce((a, b) => a + b, 0) / avgs.length : null,
    totalPrecipMm,
    maxWindKmh,
    rainyDays,
    daysAnalysed: days.length,
  };
}
