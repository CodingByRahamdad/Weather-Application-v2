# Halcyon · Weather Intelligence Dashboard

A frontend-only weather dashboard built with React, Vite and Tailwind
CSS. Uses the Open-Meteo API for geocoding and forecasts.

## Features

Core:
- City search with debounced input and request cancellation.
- Current weather, hourly forecast, 7-day forecast, weather details.
- Weather statistics (highs, lows, averages, rainy days) derived from forecast data.
- Favorites (persisted, deduped, max 20 slots).
- Search history (last 5, deduped, clearable).
- Settings: temperature / wind / precipitation units, theme (light / dark / auto),
  reduce motion, high contrast, forecast range, dashboard toggles.
- Client-side routing via URL hash; deep links via `#/weather?lat=…&lon=…&name=…`.
- LocalStorage persistence with corruption-safe reads.

Bonus:
- Automatic location detection via the Geolocation API.
- Charts (temperature area, precipitation bars, wind line) via Recharts.
- Debounced search (350ms).
- Request cancellation via `AbortController` for both search and weather.
- Weather comparison: pick two favorites on the Statistics page and see
  their current conditions and 7-day figures side by side.
- Automated unit tests (Vitest) for the pure calculation/utility logic —
  see `TESTING.md`.

## Tech stack

- React 19
- Vite 7
- Tailwind CSS 4 (dark: variants, design tokens defined in `src/index.css`)
- Recharts (charts)
- lucide-react (icons)
- No backend, no database, no framework routing

## Setup

```bash
npm install
npm run dev      # dev server
npm run build    # production build (single-file dist/index.html)
npm run preview  # preview built artifact
```

Open the app and search for a city, or click "Use my location".

## Open-Meteo endpoints

- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`

The service layer transforms columnar Open-Meteo responses (`time[]`, `temperature_2m[]`, …)
into application-specific objects (see the transformation logic in
`src/services/weatherService.js` and `src/services/geocodingService.js`).

## Routes (hash-based)

- `#/weather` – dashboard (main view)
- `#/favorites` – saved locations
- `#/history` – recent searches
- `#/statistics` – aggregate statistics + charts
- `#/settings` – preferences

## LocalStorage keys

- `halcyon.settings.v1`
- `halcyon.favorites.v1`
- `halcyon.history.v1`
- `halcyon.lastLocation.v1`

All reads use a defensive `readJson` helper — invalid JSON is discarded silently.

## Responsive

- Mobile-first Tailwind utilities.
- Sidebar collapses into an off-canvas drawer under `lg`.
- Hourly/daily rows scroll horizontally within their containers only.
- Analytics chart uses `ResponsiveContainer`.

## Testing checklist

See `TESTING.md`.
