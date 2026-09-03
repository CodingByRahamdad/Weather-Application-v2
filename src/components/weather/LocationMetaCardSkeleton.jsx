import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";

export function LocationMetaCardSkeleton() {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <Skeleton delay={0} className="h-5 w-20" />
        <Skeleton delay={1} className="h-4 w-4 rounded-full" />
      </div>
      <Skeleton delay={2} className="mt-4 h-[90px] w-full rounded-lg" />
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <Skeleton delay={3} className="h-4 w-32" />
          <Skeleton delay={4} className="mt-1 h-3 w-48" />
          <Skeleton delay={5} className="mt-1 h-3 w-24" />
        </div>
        <Skeleton delay={6} className="h-8 w-16" />
      </div>
    </Card>
  );
}
