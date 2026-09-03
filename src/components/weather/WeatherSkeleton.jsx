import { AnalyticsCardSkeleton } from "../charts/AnalyticsCardSkeleton";
import { RecentSearchesSkeleton } from "../search/RecentSearchesSkeleton";
import { useApp } from "../../context/AppContext";
import { Skeleton } from "../common/Skeleton";
import { CurrentWeatherCardSkeleton } from "./CurrentWeatherCardSkeleton";
import { DailyForecastSkeleton } from "./DailyForecastSkeleton";
import { HourlyForecastSkeleton } from "./HourlyForecastSkeleton";
import { LocationMetaCardSkeleton } from "./LocationMetaCardSkeleton";
import { StatisticsCardSkeleton } from "./StatisticsCardSkeleton";
import { SunPathSkeleton } from "./SunPathSkeleton";
import { WeatherDetailsSkeleton } from "./WeatherDetailsSkeleton";

export function WeatherSkeleton() {
  const { settings } = useApp();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="flex xl:col-span-2"><CurrentWeatherCardSkeleton /></div>
        <div className="flex">{settings.showChart ? <AnalyticsCardSkeleton /> : <LocationMetaCardSkeleton />}</div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="flex xl:col-span-2"><HourlyForecastSkeleton /></div>
        <div className="flex"><SunPathSkeleton /></div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="flex"><DailyForecastSkeleton /></div>
        <div className="flex"><WeatherDetailsSkeleton /></div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {settings.showStatistics ? <div className="flex"><StatisticsCardSkeleton /></div> : null}
        <div className="flex"><LocationMetaCardSkeleton /></div>
        <div className="flex"><RecentSearchesSkeleton /></div>
      </div>

      <div className="flex justify-center pt-2">
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </div>
  );
}
