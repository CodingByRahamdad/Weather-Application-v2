// WMO weather-code mapping used across the app.

const MAP = {
  0: { label: "Clear sky", kind: "clear" },
  1: { label: "Mainly clear", kind: "clear" },
  2: { label: "Partly cloudy", kind: "partly-cloudy" },
  3: { label: "Overcast", kind: "cloudy" },
  45: { label: "Fog", kind: "fog" },
  48: { label: "Rime fog", kind: "fog" },
  51: { label: "Light drizzle", kind: "drizzle" },
  53: { label: "Drizzle", kind: "drizzle" },
  55: { label: "Heavy drizzle", kind: "drizzle" },
  56: { label: "Freezing drizzle", kind: "sleet" },
  57: { label: "Freezing drizzle", kind: "sleet" },
  61: { label: "Light rain", kind: "rain" },
  63: { label: "Rain", kind: "rain" },
  65: { label: "Heavy rain", kind: "heavy-rain" },
  66: { label: "Freezing rain", kind: "sleet" },
  67: { label: "Freezing rain", kind: "sleet" },
  71: { label: "Light snow", kind: "snow" },
  73: { label: "Snow", kind: "snow" },
  75: { label: "Heavy snow", kind: "snow" },
  77: { label: "Snow grains", kind: "snow" },
  80: { label: "Rain showers", kind: "showers" },
  81: { label: "Rain showers", kind: "showers" },
  82: { label: "Violent showers", kind: "heavy-rain" },
  85: { label: "Snow showers", kind: "snow" },
  86: { label: "Snow showers", kind: "snow" },
  95: { label: "Thunderstorm", kind: "thunderstorm" },
  96: { label: "Thunderstorm w/ hail", kind: "thunderstorm" },
  99: { label: "Thunderstorm w/ hail", kind: "thunderstorm" },
};

export function describeWeather(code) {
  if (code === null || code === undefined || !MAP[code]) {
    return { code: code ?? 0, label: "Unknown", kind: "cloudy" };
  }
  return { code, ...MAP[code] };
}

export function isRainy(code) {
  const kind = describeWeather(code).kind;
  return ["drizzle", "rain", "heavy-rain", "showers", "thunderstorm", "sleet"].includes(kind);
}

export function isSnowy(code) {
  return describeWeather(code).kind === "snow";
}
