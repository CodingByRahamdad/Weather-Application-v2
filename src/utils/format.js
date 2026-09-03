// Small, reusable formatting helpers.

export function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32;
}

export function convertTemperature(celsius, unit) {
  if (celsius === null || celsius === undefined || Number.isNaN(celsius)) return null;
  return unit === "fahrenheit" ? celsiusToFahrenheit(celsius) : celsius;
}

export function formatTemp(celsius, unit, digits = 0) {
  const v = convertTemperature(celsius, unit);
  if (v === null) return "—";
  const p = Math.pow(10, digits);
  return `${Math.round(v * p) / p}°`;
}

export function unitSymbol(unit) {
  return unit === "fahrenheit" ? "°F" : "°C";
}

export function convertWind(kmh, unit) {
  if (unit === "mph") return kmh * 0.621371;
  if (unit === "ms") return kmh / 3.6;
  return kmh;
}

export function windUnitLabel(unit) {
  if (unit === "mph") return "mph";
  if (unit === "ms") return "m/s";
  return "km/h";
}

export function formatWind(kmh, unit) {
  if (kmh === null || kmh === undefined || Number.isNaN(kmh)) return "—";
  return `${Math.round(convertWind(kmh, unit))}`;
}

export function convertPrecip(mm, unit) {
  return unit === "inch" ? mm / 25.4 : mm;
}

export function precipUnitLabel(unit) {
  return unit === "inch" ? "in" : "mm";
}

const COMPASS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
export function degreesToCompass(deg) {
  if (deg === null || deg === undefined || Number.isNaN(deg)) return "—";
  const idx = Math.round((deg % 360) / 22.5) % 16;
  return COMPASS[idx];
}

export function formatTime(iso, timezone) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
    }).format(d);
  } catch {
    return iso;
  }
}

export function formatHour(iso, timezone) {
  try {
    const d = new Date(iso);
    const hour = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: true,
      timeZone: timezone,
    }).format(d);
    return hour.toUpperCase();
  } catch {
    return iso;
  }
}

export function formatShortDay(iso, timezone) {
  try {
    const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : ""));
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      timeZone: timezone,
    }).format(d);
  } catch {
    return iso;
  }
}

export function formatShortDate(iso, timezone) {
  try {
    const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : ""));
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      timeZone: timezone,
    }).format(d);
  } catch {
    return iso;
  }
}

export function formatLongDate(d = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function getDayNumber(iso, timezone) {
  try {
    const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : ""));
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      timeZone: timezone,
    }).format(d);
  } catch {
    return "";
  }
}

export function relativeFromNow(iso) {
  if (!iso) return "just now";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.round((now - then) / 1000));
  if (diff < 45) return "just now";
  if (diff < 90) return "1 min ago";
  if (diff < 3600) return `${Math.round(diff / 60)} min ago`;
  if (diff < 5400) return "1 h ago";
  if (diff < 86400) return `${Math.round(diff / 3600)} h ago`;
  const days = Math.round(diff / 86400);
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 5) return "Good evening";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
