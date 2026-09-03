import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";

export function DailyForecastSkeleton() {
  return (
    <Card>
      <div className="flex flex-col gap-3">
        <Skeleton delay={0} className="h-5 w-32" />
        <div className="thin-scrollbar flex w-full min-w-0 items-center gap-2 overflow-x-auto pb-1">
          <Skeleton delay={1} className="h-9 w-28 rounded-[12px]" />
          <Skeleton delay={2} className="h-9 w-32 rounded-[12px]" />
          <Skeleton delay={3} className="h-9 w-32 rounded-[12px]" />
        </div>
      </div>
      <div className="thin-scrollbar mt-3 flex flex-1 -mx-2 overflow-x-auto pb-2">
        <div className="flex h-full min-w-max gap-2 px-2">
          {Array.from({ length: 7 }, (_, index) => (
            <div key={index} className="flex h-full w-[92px] shrink-0 flex-col items-center justify-between rounded-[18px] border border-[#E1E6ED]/42 bg-white/40 p-3 text-center dark:border-ink-600/28 dark:bg-ink-800/35">
              <div>
                <Skeleton delay={4 + index} className="h-3 w-16" />
                <Skeleton delay={5 + index} className="mt-0.5 h-2.5 w-14" />
              </div>
              <Skeleton delay={6 + index} className="h-8 w-8 rounded-full" />
              <Skeleton delay={7 + index} className="h-5 w-14" />
              <Skeleton delay={8 + index} className="h-3 w-12" />
              <Skeleton delay={9 + index} className="h-2 w-12" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
