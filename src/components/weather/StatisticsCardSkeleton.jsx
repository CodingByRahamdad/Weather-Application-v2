import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";

export function StatisticsCardSkeleton() {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Skeleton delay={0} className="h-5 w-36" />
        <Skeleton delay={1} className="h-3 w-20" />
      </div>
      <dl className="mt-auto grid grid-cols-2 gap-2 pt-4">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="rounded-[17px] border border-[#E1E6ED]/42 bg-white/40 p-3 dark:border-ink-600/28 dark:bg-ink-800/35">
            <Skeleton delay={2 + index} className="h-2.5 w-16" />
            <Skeleton delay={8 + index} className="mt-1 h-5 w-20" />
          </div>
        ))}
      </dl>
    </Card>
  );
}
