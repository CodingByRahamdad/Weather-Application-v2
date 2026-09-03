import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";

export function HourlyForecastSkeleton() {
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Skeleton delay={0} className="h-5 w-32" />
          <Skeleton delay={1} className="mt-0.5 h-3 w-44" />
        </div>
        <Skeleton delay={2} className="h-9 w-full rounded-[16px] sm:w-56" />
      </div>
      <div className="thin-scrollbar mt-auto -mx-2 overflow-x-auto overflow-y-hidden px-0 pb-2 pt-6">
        <div className="flex min-w-max gap-2 px-2">
          {Array.from({ length: 10 }, (_, index) => (
            <div key={index} className="flex w-[68px] shrink-0 flex-col items-center rounded-[18px] border border-[#E1E6ED]/42 bg-white/40 px-2 py-3 sm:w-[76px] dark:border-ink-600/28 dark:bg-ink-800/35">
              <Skeleton delay={3 + index} className="h-2 w-12" />
              <Skeleton delay={4 + index} className="mt-2 h-6 w-6 rounded-full" />
              <Skeleton delay={5 + index} className="mt-2 h-5 w-12" />
              <Skeleton delay={6 + index} className="mt-2 h-2 w-10" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
