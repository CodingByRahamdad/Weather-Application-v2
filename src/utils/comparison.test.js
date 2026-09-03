import { describe, expect, it } from "vitest";
import { buildComparisonRows } from "./comparison";

const settings = { temperatureUnit: "celsius", windUnit: "kmh", precipUnit: "mm" };

const bundle = (overrides = {}) => ({
  current: { apparentC: 18, humidity: 55, ...overrides.current },
  daily: overrides.daily ?? [
    { tempMaxC: 22, tempMinC: 12, precipMm: 1, windMaxKmh: 20, weatherCode: 0 },
    { tempMaxC: 25, tempMinC: 15, precipMm: 0, windMaxKmh: 30, weatherCode: 0 },
  ],
});

describe("buildComparisonRows", () => {
  it("returns a row for each comparable metric", () => {
    const rows = buildComparisonRows(bundle(), bundle(), settings);
    const labels = rows.map((r) => r.label);
    expect(labels).toEqual([
      "Feels like",
      "7-day high",
      "7-day low",
      "Total precip.",
      "Max wind",
      "Humidity",
    ]);
  });

  it("formats temperatures in the selected unit", () => {
    const rows = buildComparisonRows(bundle(), bundle(), {
      ...settings,
      temperatureUnit: "fahrenheit",
    });
    const high = rows.find((r) => r.label === "7-day high");
    // 25C -> 77F
    expect(high.leftValue).toBe("77°F");
  });

  it("picks the higher max temperature between two different bundles", () => {
    const left = bundle({ daily: [{ tempMaxC: 20, tempMinC: 10, precipMm: 0, windMaxKmh: 10, weatherCode: 0 }] });
    const right = bundle({ daily: [{ tempMaxC: 30, tempMinC: 20, precipMm: 0, windMaxKmh: 10, weatherCode: 0 }] });
    const rows = buildComparisonRows(left, right, settings);
    const high = rows.find((r) => r.label === "7-day high");
    expect(high.leftValue).toBe("20°C");
    expect(high.rightValue).toBe("30°C");
  });

  it("falls back to an em dash when a bundle is not loaded yet", () => {
    const rows = buildComparisonRows(null, bundle(), settings);
    const high = rows.find((r) => r.label === "7-day high");
    expect(high.leftValue).toBe("—");
    expect(high.rightValue).not.toBe("—");
  });

  it("shows humidity as a rounded percentage", () => {
    const left = bundle({ current: { apparentC: 18, humidity: 54.6 } });
    const rows = buildComparisonRows(left, bundle(), settings);
    const humidity = rows.find((r) => r.label === "Humidity");
    expect(humidity.leftValue).toBe("55%");
  });
});
