import { describe, expect, it } from "vitest";
import { transformAirQuality } from "./weatherService";

describe("transformAirQuality", () => {
  it("maps Open-Meteo US AQI data to a rounded UI value and category", () => {
    expect(transformAirQuality({ current: { us_aqi: 51.4 } })).toEqual({
      value: 51,
      category: "Moderate",
      tone: "warning",
      status: "available",
    });
  });

  it("returns an unavailable state when the API omits AQI", () => {
    expect(transformAirQuality({ current: {} })).toEqual({
      value: null,
      category: "Unavailable",
      tone: "muted",
      status: "unavailable",
    });
  });
});