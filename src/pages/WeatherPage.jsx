import { useEffect, useMemo, useRef } from "react";
import { Compass, Locate, LocateFixed } from "lucide-react";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { CurrentWeatherCard } from "../components/weather/CurrentWeatherCard";
import { HourlyForecast } from "../components/weather/HourlyForecast";
import { DailyForecast } from "../components/weather/DailyForecast";
import { WeatherDetails } from "../components/weather/WeatherDetails";
import { SunPath } from "../components/weather/SunPath";
import { AnalyticsCard } from "../components/charts/AnalyticsCard";
import { WeatherSkeleton } from "../components/weather/WeatherSkeleton";
import { StatisticsCard } from "../components/weather/StatisticsCard";
import { RecentSearches } from "../components/search/RecentSearches";
import { LocationMetaCard } from "../components/weather/LocationMetaCard";
import { useApp } from "../context/AppContext";
import { useWeather } from "../hooks/useWeather";
import { useGeolocation } from "../hooks/useGeolocation";
import { Button } from "../components/common/Button";

export function WeatherPage({ urlParams, navigate }) {
  const { selectedLocation, selectLocation, settings, toast } = useApp();

  // URL → location on first render.
  const urlAppliedRef = useRef(false);
  useEffect(() => {
    if (urlAppliedRef.current) return;
    urlAppliedRef.current = true;
    const lat = parseFloat(urlParams.get("lat") ?? "");
    const lon = parseFloat(urlParams.get("lon") ?? "");
    const name = urlParams.get("name");
    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      const loc = {
        id: `${lat.toFixed(4)},${lon.toFixed(4)}`,
        name: name || "Selected location",
        country: urlParams.get("country") ?? "",
        latitude: lat,
        longitude: lon,
      };
      selectLocation(loc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep URL in sync with selection.
  useEffect(() => {
    if (!selectedLocation) return;
    navigate("/weather", {
      lat: selectedLocation.latitude.toFixed(4),
      lon: selectedLocation.longitude.toFixed(4),
      name: selectedLocation.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation?.id]);

  const { data, loading, error, refresh } = useWeather(selectedLocation);
  const geo = useGeolocation();

  const onUseMyLocation = async () => {
    try {
      const coords = await geo.request();
      const loc = {
        id: `${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`,
        name: "My location",
        country: "",
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
      selectLocation(loc);
      toast({ kind: "success", title: "Location detected" });
    } catch (err) {
      toast({ kind: "error", title: "Location unavailable", message: err.message });
    }
  };

  const currentBundle = useMemo(() => data, [data]);

  if (!selectedLocation) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={<Compass className="h-10 w-10 text-accent-500" />}
          title="Choose a location to start"
          description="Search for a city or postcode above, or let your browser detect where you are right now."
          action={
            <Button variant="primary" onClick={onUseMyLocation} leftIcon={<Locate className="h-4 w-4" />}>
              Use my location
            </Button>
          }
        />
        <RecentSearches onSelect={selectLocation} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Row 1: Current weather + Analytics */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="flex xl:col-span-2">
          {loading && !currentBundle ? (
            <WeatherSkeleton />
          ) : error && !currentBundle ? (
            <ErrorMessage message={error} onRetry={refresh} />
          ) : currentBundle ? (
            <CurrentWeatherCard bundle={currentBundle} onRefresh={refresh} refreshing={loading} />
          ) : null}
        </div>
        <div className="flex">
          {currentBundle ? (
            settings.showChart ? (
              <AnalyticsCard bundle={currentBundle} variant="full" />
            ) : (
              <LocationMetaCard bundle={currentBundle} />
            )
          ) : (
            <WeatherSkeleton />
          )}
        </div>
      </div>

      {/* Row 2: Hourly + Sun path */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="flex xl:col-span-2">
          {currentBundle ? <HourlyForecast bundle={currentBundle} /> : null}
        </div>
        <div className="flex">{currentBundle ? <SunPath bundle={currentBundle} /> : null}</div>
      </div>

      {/* Row 3: Daily forecast + Weather details */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="flex">{currentBundle ? <DailyForecast bundle={currentBundle} /> : null}</div>
        <div className="flex">{currentBundle ? <WeatherDetails bundle={currentBundle} /> : null}</div>
      </div>

      {/* Row 4: Stats + Location meta + Recent */}
      {currentBundle ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {settings.showStatistics ? (
            <div className="flex">
              <StatisticsCard bundle={currentBundle} />
            </div>
          ) : null}
          <div className="flex">
            <LocationMetaCard bundle={currentBundle} />
          </div>
          <div className="flex">
            <RecentSearches onSelect={selectLocation} />
          </div>
        </div>
      ) : null}

      <div className="flex justify-center pt-2">
        <Button variant="outline" onClick={onUseMyLocation} leftIcon={<LocateFixed className="h-4 w-4" />}>
          Use my location
        </Button>
      </div>
    </div>
  );
}
