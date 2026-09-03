import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";

export function WeatherDetailsSkeleton() {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Skeleton delay={0} className="h-5 w-36" />
        <Skeleton delay={1} className="h-3 w-28" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="rounded-[17px] border border-[#E1E6ED]/42 bg-white/40 p-3 dark:border-ink-600/28 dark:bg-ink-800/35">
            <div className="flex items-center justify-between">
              <Skeleton delay={2 + index} className="h-2.5 w-20" />
              <Skeleton delay={3 + index} className="h-3.5 w-3.5 rounded-full" />
            </div>
            <Skeleton delay={4 + index} className="mt-2 h-6 w-24" />
            <Skeleton delay={5 + index} className="mt-1 h-3 w-28" />
          </div>
        ))}
      </div>
    </Card>
  );
}
