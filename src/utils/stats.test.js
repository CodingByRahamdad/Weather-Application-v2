import { describe, expect, it } from "vitest";
import { calculateStats } from "./stats";

const day = (overrides) => ({
  tempMaxC: 20,
  tempMinC: 10,
  precipMm: 0,
  windMaxKmh: 10,
  weatherCode: 0,
  ...overrides,
});

describe("calculateStats", () => {
  it("returns zeroed-out defaults for an empty forecast", () => {
    const result = calculateStats([]);
    expect(result.highTempC).toBeNull();
    expect(result.lowTempC).toBeNull();
    expect(result.avgTempC).toBeNull();
    expect(result.totalPrecipMm).toBe(0);
    expect(result.maxWindKmh).toBe(0);
    expect(result.rainyDays).toBe(0);
    expect(result.daysAnalysed).toBe(0);
  });

  it("calculates highest and lowest temperature across days", () => {
    const days = [day({ tempMaxC: 25, tempMinC: 15 }), day({ tempMaxC: 18, tempMinC: 8 })];
    const result = calculateStats(days);
    expect(result.highTempC).toBe(25);
    expect(result.lowTempC).toBe(8);
  });

  it("calculates the average of each day's midpoint temperature", () => {
    // Day 1 midpoint: (20+10)/2 = 15, Day 2 midpoint: (30+20)/2 = 25 -> avg 20
    const days = [day({ tempMaxC: 20, tempMinC: 10 }), day({ tempMaxC: 30, tempMinC: 20 })];
    const result = calculateStats(days);
    expect(result.avgTempC).toBeCloseTo(20, 5);
  });

  it("sums total precipitation across days", () => {
    const days = [day({ precipMm: 2 }), day({ precipMm: 5.5 }), day({ precipMm: 0 })];
    const result = calculateStats(days);
    expect(result.totalPrecipMm).toBeCloseTo(7.5, 5);
  });

  it("finds the maximum wind speed among days", () => {
    const days = [day({ windMaxKmh: 12 }), day({ windMaxKmh: 34 }), day({ windMaxKmh: 5 })];
    const result = calculateStats(days);
    expect(result.maxWindKmh).toBe(34);
  });

  it("counts rainy days based on weather code or measurable precipitation", () => {
    const days = [
      day({ weatherCode: 61, precipMm: 0 }), // rain code
      day({ weatherCode: 0, precipMm: 1.2 }), // clear code but real precipitation
      day({ weatherCode: 0, precipMm: 0 }), // dry, clear
    ];
    const result = calculateStats(days);
    expect(result.rainyDays).toBe(2);
  });

  it("reports how many days were analysed", () => {
    const days = [day(), day(), day()];
    expect(calculateStats(days).daysAnalysed).toBe(3);
  });
});
