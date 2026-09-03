# Architecture

```
User
 ↓
React App (src/App.jsx)
 ↓
Layout (Sidebar + Header)          ⇢ common UI (Card, Button, Toasts, …)
 ↓
Pages                              ⇢ Hooks (useWeather, useLocationSearch, …)
 ↓                                 ⇢ Context (AppProvider: settings, favorites,
Components                             history, selected location, toasts)
 ↓
Service layer (services/*)         ⇢ fetch + AbortController
 ↓
Open-Meteo API
 ↓
Transformation utilities           ⇢ WeatherBundle-shaped plain objects
 ↓
React state / props                ⇢ UI
```

## Directory layout

```
src/
  App.jsx                     # shell, routing, layout
  main.jsx                    # bootstrap
  index.css                   # Tailwind + design tokens

  components/
    common/                   # Card, Button, SegmentedControl, Toggle,
                              #   Skeleton, EmptyState, ErrorMessage, Toasts
    layout/                   # Sidebar, Header
    search/                   # SearchBar, RecentSearches
    weather/                  # CurrentWeatherCard, HourlyForecast,
                              #   DailyForecast, WeatherDetails, SunPath,
                              #   StatisticsCard, LocationMetaCard,
                              #   WeatherIcon, WeatherSkeleton
    favorites/                # FavoriteCard
    charts/                   # AnalyticsCard

  pages/                      # WeatherPage, FavoritesPage, HistoryPage,
                              #   StatisticsPage, SettingsPage

  hooks/
    useLocalStorage.js        # JSON-safe LS wrapper
    useHashRoute.js           # tiny hash router
    useDebounced.js           # debounce a value
    useLocationSearch.js      # geocoding + abort + debounce
    useWeather.js             # forecast fetch + abort + refresh
    useFavoriteWeather.js     # batch load favorites
    useGeolocation.js         # request browser geolocation
    useElementWidth.js        # ResizeObserver width tracking for charts

  services/
    geocodingService.js       # location search
    weatherService.js         # forecast + transformation

  context/
    AppContext.jsx            # settings, favorites, history, selection, toasts

  utils/
    cn.js                     # class-name merger
    format.js                 # temp/wind/precip conversion + date formatting
    weatherCodes.js           # WMO code → label / kind / icon
    stats.js                  # aggregate statistics
    storage.js                # safe JSON read/write
```

## Design decisions

- **Routing.** The build is a single-file bundle (via `vite-plugin-singlefile`),
  so we use a tiny custom hash router instead of a heavy framework.
- **State.** Settings, favorites, history and selected location live in one context;
  everything else is local component state or derived. Nothing is duplicated —
  Celsius vs Fahrenheit is a *derived view* over source Celsius.
- **Services.** All fetch calls live in `services/*` with `AbortController`
  support; UI components never see raw Open-Meteo columnar arrays.
- **Transformation.** `weatherService.transformWeather` converts arrays to
  plain application-specific objects (a `WeatherBundle`-shaped object) that
  the rest of the app consumes.
- **Persistence.** `readJson` swallows corrupted values and returns the fallback
  so a bad LocalStorage entry can never crash startup.
- **Accessibility.** Semantic HTML (`button`, `nav`, `main`, `form`),
  visible focus rings (Tailwind `focus-visible`), aria labels on icon-only
  controls, and radio/tab roles on custom segmented controls / tabs.
