import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";

export function AnalyticsCardSkeleton() {
  return (
    <Card>
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-start lg:justify-between">
        <div className="min-w-0">
          <Skeleton delay={0} className="h-5 w-24" />
          <Skeleton delay={1} className="mt-0.5 h-3 w-40" />
        </div>
        <Skeleton delay={2} className="h-9 w-full rounded-[16px] lg:w-56" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="rounded-[17px] border border-[#E1E6ED]/42 bg-white/40 p-3 dark:border-ink-600/28 dark:bg-ink-800/35">
            <Skeleton delay={3 + index} className="h-3 w-24" />
            <Skeleton delay={6 + index} className="mt-1.5 h-5 w-20" />
            <Skeleton delay={9 + index} className="mt-1 h-3 w-16" />
          </div>
        ))}
      </div>
      <Skeleton delay={12} className="mt-4 h-52 w-full rounded-lg sm:h-56" />
    </Card>
  );
}
