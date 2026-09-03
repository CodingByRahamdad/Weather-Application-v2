import { Card } from "../common/Card";
import { Skeleton } from "../common/Skeleton";

export function RecentSearchesSkeleton() {
  return (
    <Card>
      <Skeleton delay={0} className="h-5 w-32" />
      <div className="mt-4 space-y-2">
        {[0, 1, 2].map((index) => (
          <Skeleton key={index} delay={index + 1} className="h-10 w-full rounded-[14px]" />
        ))}
      </div>
    </Card>
  );
}
