# AI usage

This project was implemented with AI-assisted development.

## Tools used

- Claude (Anthropic) as a pair-programming assistant that scaffolded the initial
  component structure, wrote first-pass Tailwind classes, and helped with
  service-layer boilerplate.

## Where AI helped

- Design token setup and Tailwind theme definitions.
- Initial drafts of small utility functions (`format.js`, `weatherCodes.js`,
  `stats.js`).
- Boilerplate for reusable primitives (`Card`, `Button`, `SegmentedControl`, `Toggle`).
- Layout structure for the dashboard grid.
- Recharts wiring for the analytics tabs.

## Where the developer intervened

- All Open-Meteo endpoint choices and response transformations were verified
  against the API documentation.
- LocalStorage safety (`readJson`) and the search abort/debounce flow were
  reviewed manually to make sure requests never leak or overwrite state
  out-of-order.
- Component states (loading / error / empty), keyboard accessibility on the
  search dropdown, and mobile navigation were tested by hand.
- Visual fidelity to the supplied reference (spacing, typography, tokens,
  card composition) was iterated on manually.

## What was not AI-generated

- Product decisions: routing scheme, LocalStorage keys, exact aggregation
  formulas, and the responsive breakpoint behaviour.
- The overall visual language, which follows the supplied approved screenshots.

## Prompts used

Representative examples of prompts used during development:

- "Scaffold a WeatherPage component that composes CurrentWeatherCard,
  DailyForecast, HourlyForecast and WeatherDetails, pulling the selected
  location and weather data from AppContext."
- "Write a weatherService.js function that takes latitude/longitude, calls the
  Open-Meteo forecast endpoint, and transforms the columnar hourly/daily
  arrays into an array of per-timestamp objects."
- "Create a useDebounced hook that delays updating a value until the input has
  been stable for a given number of milliseconds, and use it to debounce the
  city search input."
- "Review this useWeather hook for race conditions when the user changes the
  selected location quickly — the previous request should not be allowed to
  overwrite a newer one."
- "Suggest a Tailwind-based dark/light theme token setup that can be toggled
  from React state and persisted to LocalStorage."

## Bugs AI introduced and how they were fixed

- **Stale closure in search debounce**: the first draft of the debounced
  search effect captured the search term from an outer scope instead of the
  debounced value, so it occasionally fired a request for the previous
  keystroke's text. Fixed by passing the debounced value itself into the
  effect's dependency array.
- **Off-by-one in forecast day labelling**: the initial date-formatting
  helper used the local browser timezone instead of the API-provided
  timezone, which shifted "today" to the wrong day near midnight for some
  timezones. Fixed by deriving the day/date labels from the timezone-aware
  timestamps returned by Open-Meteo rather than `new Date()` alone.
- **Duplicate weather requests on rapid location switching**: an early
  version of `useWeather` did not cancel in-flight requests, so switching
  favorites quickly could let an older, slower response overwrite the
  correct newer one. Fixed by adding `AbortController` and a request-id
  guard so only the most recent request is allowed to update state.
