import { describe, expect, it } from "vitest";
import {
  celsiusToFahrenheit,
  convertPrecip,
  convertTemperature,
  convertWind,
  formatTemp,
} from "./format";

describe("temperature conversion", () => {
  it("converts a positive Celsius value to Fahrenheit", () => {
    expect(celsiusToFahrenheit(20)).toBeCloseTo(68);
  });

  it("converts 0°C to 32°F", () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
  });

  it("converts a negative Celsius value to Fahrenheit", () => {
    expect(celsiusToFahrenheit(-10)).toBeCloseTo(14);
  });

  it("convertTemperature passes Celsius through unchanged for the celsius unit", () => {
    expect(convertTemperature(20, "celsius")).toBe(20);
  });

  it("convertTemperature converts to Fahrenheit for the fahrenheit unit", () => {
    expect(convertTemperature(20, "fahrenheit")).toBeCloseTo(68);
  });

  it("convertTemperature returns null for null/undefined/NaN input", () => {
    expect(convertTemperature(null, "celsius")).toBeNull();
    expect(convertTemperature(undefined, "celsius")).toBeNull();
    expect(convertTemperature(NaN, "celsius")).toBeNull();
  });

  it("formatTemp rounds to the requested number of digits", () => {
    expect(formatTemp(20.456, "celsius", 0)).toBe("20°");
    expect(formatTemp(20.456, "celsius", 1)).toBe("20.5°");
  });

  it("formatTemp returns an em dash placeholder for missing data", () => {
    expect(formatTemp(null, "celsius")).toBe("—");
  });
});

describe("wind conversion", () => {
  it("keeps km/h unchanged for the kmh unit", () => {
    expect(convertWind(36, "kmh")).toBe(36);
  });

  it("converts km/h to mph", () => {
    expect(convertWind(100, "mph")).toBeCloseTo(62.1371, 3);
  });

  it("converts km/h to m/s", () => {
    expect(convertWind(36, "ms")).toBeCloseTo(10, 5);
  });
});

describe("precipitation conversion", () => {
  it("keeps millimetres unchanged for the mm unit", () => {
    expect(convertPrecip(25.4, "mm")).toBe(25.4);
  });

  it("converts millimetres to inches", () => {
    expect(convertPrecip(25.4, "inch")).toBeCloseTo(1, 5);
  });
});
