import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";

export function CurrentWeatherCardSkeleton() {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-[#EEF2F8] dark:from-transparent dark:to-transparent dark:bg-ink-900/80">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Skeleton delay={0} className="h-3.5 w-28" />
          <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <Skeleton delay={1} className="h-12 w-48 sm:h-14" />
            <Skeleton delay={2} className="h-4 w-36" />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((delay) => (
            <Skeleton key={delay} delay={delay} className="h-9 w-9 rounded-[16px]" />
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-start gap-x-8 gap-y-4">
        <div className="flex items-baseline gap-1">
          <Skeleton delay={3} className="h-20 w-24 sm:h-24 sm:w-28" />
          <Skeleton delay={4} className="h-6 w-5" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton delay={5} className="h-16 w-16 rounded-full sm:h-20 sm:w-20" />
          <div>
            <Skeleton delay={6} className="h-5 w-32" />
            <Skeleton delay={7} className="mt-2 h-4 w-40" />
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
        <Skeleton delay={8} className="h-4 w-32" />
        <Skeleton delay={9} className="h-4 w-16" />
        <div className="ml-auto flex items-center gap-4">
          <Skeleton delay={10} className="h-3 w-24" />
          <div className="rounded-[17px] bg-white/45 px-3 py-2 dark:bg-ink-800/45">
            <Skeleton delay={11} className="h-2 w-16" />
            <Skeleton delay={12} className="mt-1 h-5 w-24" />
          </div>
        </div>
      </div>
    </Card>
  );
}
