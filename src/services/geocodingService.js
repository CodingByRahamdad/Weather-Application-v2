const BASE = "https://geocoding-api.open-meteo.com/v1/search";

export async function searchLocations(query, signal, count = 8) {
  const q = query.trim();
  if (!q) return [];

  const url = `${BASE}?name=${encodeURIComponent(q)}&count=${count}&language=en&format=json`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  const data = await res.json();

  const raw = data?.results ?? [];
  return raw.map((r) => ({
    id: `${r.latitude.toFixed(4)},${r.longitude.toFixed(4)}`,
    name: r.name,
    country: r.country ?? "",
    countryCode: r.country_code,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
    population: r.population,
  }));
}

// Simple coordinate-based fallback used after geolocation.
export async function reverseLookup(lat, lon) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return {
    id: `${lat.toFixed(4)},${lon.toFixed(4)}`,
    name: "My location",
    country: "",
    latitude: lat,
    longitude: lon,
    timezone,
  };
}
