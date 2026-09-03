import { describe, expect, it } from "vitest";
import { describeWeather, isRainy, isSnowy } from "./weatherCodes";

describe("describeWeather", () => {
  it("maps known WMO codes to a readable label", () => {
    expect(describeWeather(0).label).toBe("Clear sky");
    expect(describeWeather(3).label).toBe("Overcast");
    expect(describeWeather(45).kind).toBe("fog");
    expect(describeWeather(61).kind).toBe("rain");
    expect(describeWeather(71).kind).toBe("snow");
    expect(describeWeather(95).kind).toBe("thunderstorm");
  });

  it("falls back to a safe default for an unrecognised code", () => {
    const result = describeWeather(9999);
    expect(result.label).toBe("Unknown");
    expect(result.kind).toBe("cloudy");
  });

  it("falls back to a safe default for a missing code", () => {
    const result = describeWeather(null);
    expect(result.label).toBe("Unknown");
  });
});

describe("isRainy", () => {
  it("returns true for rain-family codes", () => {
    expect(isRainy(61)).toBe(true);
    expect(isRainy(80)).toBe(true);
    expect(isRainy(95)).toBe(true);
  });

  it("returns false for clear/cloudy/snow codes", () => {
    expect(isRainy(0)).toBe(false);
    expect(isRainy(3)).toBe(false);
    expect(isRainy(71)).toBe(false);
  });
});

describe("isSnowy", () => {
  it("returns true for snow codes", () => {
    expect(isSnowy(71)).toBe(true);
    expect(isSnowy(75)).toBe(true);
  });

  it("returns false for rain/clear codes", () => {
    expect(isSnowy(61)).toBe(false);
    expect(isSnowy(0)).toBe(false);
  });
});
