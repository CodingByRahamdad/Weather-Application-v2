import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";

export function WeatherSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-4 h-10 w-48" />
        <Skeleton className="mt-6 h-20 w-40" />
        <div className="mt-5 flex gap-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-7 w-20" />
        </div>
      </Card>
      <Card>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-20 w-full" />
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </Card>
    </div>
  );
}
