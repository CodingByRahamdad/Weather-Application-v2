// WMO weather-code mapping used across the app.

const MAP = {
  0: { label: "Clear sky", kind: "clear", emoji: "☀️" },
  1: { label: "Mainly clear", kind: "mostly-clear", emoji: "🌤️" },
  2: { label: "Partly cloudy", kind: "partly-cloudy", emoji: "⛅" },
  3: { label: "Overcast", kind: "cloudy", emoji: "☁️" },
  45: { label: "Fog", kind: "fog", emoji: "🌫️" },
  48: { label: "Rime fog", kind: "fog", emoji: "🌫️" },
  51: { label: "Light drizzle", kind: "drizzle", emoji: "🌦️" },
  53: { label: "Drizzle", kind: "drizzle", emoji: "🌦️" },
  55: { label: "Heavy drizzle", kind: "drizzle", emoji: "🌦️" },
  56: { label: "Freezing drizzle", kind: "sleet", emoji: "🌧️" },
  57: { label: "Freezing drizzle", kind: "sleet", emoji: "🌧️" },
  61: { label: "Light rain", kind: "rain", emoji: "🌧️" },
  63: { label: "Rain", kind: "rain", emoji: "🌧️" },
  65: { label: "Heavy rain", kind: "heavy-rain", emoji: "🌧️" },
  66: { label: "Freezing rain", kind: "sleet", emoji: "🌧️" },
  67: { label: "Freezing rain", kind: "sleet", emoji: "🌧️" },
  71: { label: "Light snow", kind: "snow", emoji: "🌨️" },
  73: { label: "Snow", kind: "snow", emoji: "🌨️" },
  75: { label: "Heavy snow", kind: "snow", emoji: "❄️" },
  77: { label: "Snow grains", kind: "snow", emoji: "❄️" },
  80: { label: "Rain showers", kind: "showers", emoji: "🌦️" },
  81: { label: "Rain showers", kind: "showers", emoji: "🌦️" },
  82: { label: "Violent showers", kind: "heavy-rain", emoji: "⛈️" },
  85: { label: "Snow showers", kind: "snow", emoji: "🌨️" },
  86: { label: "Snow showers", kind: "snow", emoji: "❄️" },
  95: { label: "Thunderstorm", kind: "thunderstorm", emoji: "⛈️" },
  96: { label: "Thunderstorm w/ hail", kind: "thunderstorm", emoji: "⛈️" },
  99: { label: "Thunderstorm w/ hail", kind: "thunderstorm", emoji: "⛈️" },
};

export function describeWeather(code) {
  if (code === null || code === undefined || !MAP[code]) {
    return { code: code ?? 0, label: "Unknown", kind: "cloudy", emoji: "☁️" };
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
