import { describe, expect, it } from "vitest";
import { getAutoRefreshDelay } from "./useWeather";

describe("getAutoRefreshDelay", () => {
  it("allows the supported intervals", () => {
    expect(getAutoRefreshDelay(5)).toBe(300_000);
    expect(getAutoRefreshDelay("10")).toBe(600_000);
    expect(getAutoRefreshDelay(15)).toBe(900_000);
  });

  it("disables automatic refresh for off and invalid settings", () => {
    expect(getAutoRefreshDelay(0)).toBeNull();
    expect(getAutoRefreshDelay(undefined)).toBeNull();
    expect(getAutoRefreshDelay(20)).toBeNull();
  });
});