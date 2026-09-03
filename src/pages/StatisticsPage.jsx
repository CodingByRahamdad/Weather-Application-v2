import { useNavigate } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useWeather } from "../hooks/useWeather";
import { StatisticsCard } from "../components/weather/StatisticsCard";
import { AnalyticsCard } from "../components/charts/AnalyticsCard";
import { WeatherComparisonCard } from "../components/weather/WeatherComparisonCard";
import { EmptyState } from "../components/common/EmptyState";
import { WeatherSkeleton } from "../components/weather/WeatherSkeleton";
import { Button } from "../components/common/Button";

export function StatisticsPage() {
  const navigate = useNavigate();
  const { selectedLocation, settings } = useApp();
  const { data, loading } = useWeather(selectedLocation, settings.autoRefreshMinutes);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-mono uppercase tracking-widest text-ink-400">Statistics</p>
        <h2 className="mt-1 font-display text-3xl text-ink-900 dark:text-ink-50 sm:text-4xl">
          Deeper trends
        </h2>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">
          Aggregates calculated from the 7-day forecast for{" "}
          <span className="text-ink-900 dark:text-ink-50">
            {selectedLocation?.name ?? "your selected location"}
          </span>
          .
        </p>
      </div>

      {!selectedLocation ? (
        <EmptyState
          icon={<LayoutGrid className="h-10 w-10 text-accent-500" />}
          title="Pick a location"
          description="Statistics are calculated per location. Select one first."
          action={<Button variant="primary" onClick={() => navigate("/weather")}>Go to dashboard</Button>}
        />
      ) : loading && !data ? (
        <WeatherSkeleton />
      ) : data ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="flex xl:col-span-2">
            <AnalyticsCard bundle={data} />
          </div>
          <div className="flex">
            <StatisticsCard bundle={data} />
          </div>
        </div>
      ) : null}

      <WeatherComparisonCard />
    </div>
  );
}
