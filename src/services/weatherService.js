const BASE = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_BASE = "https://air-quality-api.open-meteo.com/v1/air-quality";

const CURRENT_VARS = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "precipitation",
  "weather_code",
  "cloud_cover",
  "pressure_msl",
  "surface_pressure",
  "wind_speed_10m",
  "wind_direction_10m",
  "is_day",
  "visibility",
].join(",");

const HOURLY_VARS = [
  "temperature_2m",
  "apparent_temperature",
  "precipitation_probability",
  "precipitation",
  "weather_code",
  "wind_speed_10m",
  "wind_direction_10m",
  "relative_humidity_2m",
  "is_day",
].join(",");

const DAILY_VARS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_max",
  "wind_speed_10m_max",
  "wind_direction_10m_dominant",
  "uv_index_max",
  "sunrise",
  "sunset",
].join(",");

export async function fetchWeather(location, signal) {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: CURRENT_VARS,
    hourly: HOURLY_VARS,
    daily: DAILY_VARS,
    timezone: "auto",
    forecast_days: "7",
    wind_speed_unit: "kmh",
    temperature_unit: "celsius",
    precipitation_unit: "mm",
  });

  const res = await fetch(`${BASE}?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`Weather request failed (${res.status})`);
  const raw = await res.json();
  const bundle = transformWeather(raw, location);

  // Air quality is supplementary: a temporary AQ API failure must not hide
  // otherwise valid weather data from the dashboard.
  try {
    bundle.airQuality = await fetchAirQuality(location, signal);
  } catch (error) {
    if (signal?.aborted) throw error;
    bundle.airQuality = unavailableAirQuality();
  }

  return bundle;
}

async function fetchAirQuality(location, signal) {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: "us_aqi",
    timezone: "auto",
  });
  const res = await fetch(`${AIR_QUALITY_BASE}?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`Air quality request failed (${res.status})`);
  return transformAirQuality(await res.json());
}

// Convert raw Open-Meteo response into typed app-level objects.
function transformWeather(raw, location) {
  const timezone = raw?.timezone ?? location.timezone ?? "UTC";
  const c = raw?.current ?? {};

  const current = {
    time: c.time ?? new Date().toISOString(),
    temperatureC: numOrNull(c.temperature_2m),
    apparentC: numOrNull(c.apparent_temperature),
    weatherCode: c.weather_code ?? 0,
    windSpeedKmh: numOrNull(c.wind_speed_10m),
    windDirectionDeg: numOrNull(c.wind_direction_10m),
    humidity: numOrNull(c.relative_humidity_2m),
    precipitationMm: numOrNull(c.precipitation),
    isDay: !!c.is_day,
    cloudCover: numOrNull(c.cloud_cover),
    pressureHpa: numOrNull(c.pressure_msl),
    surfacePressureHpa: numOrNull(c.surface_pressure),
    uvIndex: null,
    visibilityKm:
      c.visibility !== undefined && c.visibility !== null ? c.visibility / 1000 : null,
  };

  const h = raw?.hourly ?? {};
  const hourlyLen = Array.isArray(h.time) ? h.time.length : 0;
  const hourly = [];
  for (let i = 0; i < hourlyLen; i++) {
    hourly.push({
      time: h.time[i],
      temperatureC: numOrNull(h.temperature_2m?.[i]),
      apparentC: numOrNull(h.apparent_temperature?.[i]),
      precipMm: numOrNull(h.precipitation?.[i]),
      precipProbability: numOrNull(h.precipitation_probability?.[i]),
      weatherCode: h.weather_code?.[i] ?? 0,
      windSpeedKmh: numOrNull(h.wind_speed_10m?.[i]),
      windDirectionDeg: numOrNull(h.wind_direction_10m?.[i]),
      humidity: numOrNull(h.relative_humidity_2m?.[i]),
      isDay: !!h.is_day?.[i],
    });
  }

  const d = raw?.daily ?? {};
  const dailyLen = Array.isArray(d.time) ? d.time.length : 0;
  const daily = [];
  for (let i = 0; i < dailyLen; i++) {
    daily.push({
      date: d.time[i],
      tempMaxC: numOrNull(d.temperature_2m_max?.[i]),
      tempMinC: numOrNull(d.temperature_2m_min?.[i]),
      weatherCode: d.weather_code?.[i] ?? 0,
      precipMm: numOrNull(d.precipitation_sum?.[i]),
      precipProbabilityMax: numOrNull(d.precipitation_probability_max?.[i]),
      windMaxKmh: numOrNull(d.wind_speed_10m_max?.[i]),
      windDirectionDeg: numOrNull(d.wind_direction_10m_dominant?.[i]),
      uvIndexMax: numOrNull(d.uv_index_max?.[i]),
      sunrise: d.sunrise?.[i] ?? null,
      sunset: d.sunset?.[i] ?? null,
    });
  }

  if (daily[0]?.uvIndexMax !== null && daily[0]?.uvIndexMax !== undefined) {
    current.uvIndex = daily[0].uvIndexMax;
  }

  return {
    location: { ...location, timezone },
    fetchedAt: new Date().toISOString(),
    current,
    hourly,
    daily,
    timezone,
    airQuality: unavailableAirQuality(),
  };
}

// Open-Meteo's us_aqi follows the US EPA 0–500 AQI scale.
export function transformAirQuality(raw) {
  const value = numOrNull(raw?.current?.us_aqi);
  if (value === null) return unavailableAirQuality();

  const roundedValue = Math.round(value);
  if (roundedValue <= 50) return { value: roundedValue, category: "Good", tone: "success", status: "available" };
  if (roundedValue <= 100) return { value: roundedValue, category: "Moderate", tone: "warning", status: "available" };
  if (roundedValue <= 150) return { value: roundedValue, category: "Unhealthy for sensitive groups", tone: "warning", status: "available" };
  if (roundedValue <= 200) return { value: roundedValue, category: "Unhealthy", tone: "danger", status: "available" };
  if (roundedValue <= 300) return { value: roundedValue, category: "Very unhealthy", tone: "danger", status: "available" };
  return { value: roundedValue, category: "Hazardous", tone: "danger", status: "available" };
}

function unavailableAirQuality() {
  return { value: null, category: "Unavailable", tone: "muted", status: "unavailable" };
}

function numOrNull(v) {
  if (v === null || v === undefined) return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}
