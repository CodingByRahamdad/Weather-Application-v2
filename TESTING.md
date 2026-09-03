# Testing

This project has both automated unit tests (Vitest) for the pure
calculation/utility logic, and a manually-exercised checklist for the
end-to-end user flows that involve the browser, network, and UI.

## Running the automated tests

```bash
npm test          # runs the full suite once
npm run test:watch  # re-runs on file changes
```

40 tests across 5 files, all currently passing.

## Automated unit test coverage

### Temperature/wind/precipitation conversion (`src/utils/format.test.js`)
- Celsius → Fahrenheit for a positive value, 0°C, and a negative value.
- `convertTemperature` passes Celsius through unchanged for the `celsius`
  unit, and returns `null` (not `NaN`) for null/undefined/`NaN` input.
- `formatTemp` rounds correctly to a requested digit count and falls back to
  an em dash placeholder when there's no data.
- Wind conversion between km/h, mph, and m/s.
- Precipitation conversion between mm and inches.

### Average/aggregate statistics (`src/utils/stats.test.js`)
- Empty forecast returns `null`/`0` defaults instead of throwing or
  returning `NaN`.
- Highest/lowest temperature across a multi-day forecast.
- Average temperature (mean of each day's min/max midpoint).
- Total precipitation summed across days.
- Maximum wind speed across days.
- Rainy-day count, based on either the weather code or measurable
  precipitation.

### Weather code mapping (`src/utils/weatherCodes.test.js`)
- A sample of Open-Meteo WMO codes (clear, cloudy, fog, rain, snow,
  thunderstorm) resolve to the correct label/kind.
- An unrecognised or missing code falls back to a safe "Unknown" default
  instead of rendering blank or throwing.
- `isRainy` / `isSnowy` correctly classify rain-family and snow-family
  codes.

### Favorite duplicate / limit detection (`src/utils/favorites.test.js`)
- Adding a new location to an empty list succeeds.
- Adding the same location twice is rejected as a duplicate and the list
  stays at length 1.
- Adding a favorite past the configured maximum is rejected with reason
  `"limit"` and the list stops growing.
- Neither `addFavoriteToList` nor `removeFavoriteFromList` mutates the
  array that was passed in.

This logic was extracted out of `AppContext.jsx` into
`src/utils/favorites.js` specifically so it could be tested as a pure
function, independent of React state — the same reasoning behind keeping
`format.js`, `stats.js`, and `weatherCodes.js` framework-free.

### Weather comparison rows (`src/utils/comparison.test.js`)
- Produces one row per comparable metric (feels-like, 7-day high/low,
  total precipitation, max wind, humidity).
- Formats temperatures in whichever unit is currently selected.
- Correctly reflects a real difference between two different bundles
  (e.g. one city's high is higher than the other's).
- Falls back to an em dash for a side that hasn't loaded yet, without
  affecting the side that has.
- Rounds humidity to a whole-number percentage.

This logic was extracted out of `WeatherComparisonCard.jsx` into
`src/utils/comparison.js` for the same reason — so the row-building math
can be tested without rendering a component or mocking the weather API.

## Manual flow coverage

- Search for a valid city → results appear, trimmed/validated input, no
  request fired for an empty or whitespace-only query.
- Submit the search form (Enter key or the search button) → selects the
  highlighted/first result, matching "form submission" as a distinct
  interaction from the live debounced results list.
- Search for a nonsense/invalid city → empty-results state shown, no crash.
- Select a search result → becomes the active location, weather loads.
- Toggle temperature unit and theme → persists after a full browser
  refresh, with no light/dark flash on reload.
- Refresh the browser with corrupted `localStorage` JSON in one of the
  `halcyon.*` keys → app falls back to defaults instead of crashing.
- Open a URL with `#/weather?lat=&lon=&name=` for a valid location → that
  location loads on first render.
- Open a URL with an invalid/missing lat-lon → app falls back to the empty
  state instead of erroring.
- Disconnect the network mid-search and mid-weather-fetch → error state
  with a retry option, no unhandled promise rejection in the console.
- Apply each forecast filter (rain, strong wind, high temp) and each sort
  order → list updates without mutating the underlying forecast array.
- Clear search history → list empties and stays empty after refresh.
- Statistics page: select two favorite cities in the comparison card →
  side-by-side temperature/precipitation/wind comparison loads from the
  API for both locations.

