import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";

export function SunPathSkeleton() {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Skeleton delay={0} className="h-5 w-20" />
        <Skeleton delay={1} className="h-3 w-20" />
      </div>
      <Skeleton delay={2} className="mt-auto h-28 w-full rounded-lg" />
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton delay={3} className="h-4 w-4 rounded-full" />
          <div><Skeleton delay={4} className="h-2 w-12" /><Skeleton delay={5} className="mt-1 h-4 w-16" /></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right"><Skeleton delay={6} className="ml-auto h-2 w-12" /><Skeleton delay={7} className="mt-1 ml-auto h-4 w-16" /></div>
          <Skeleton delay={8} className="h-4 w-4 rounded-full" />
        </div>
      </div>
    </Card>
  );
}
