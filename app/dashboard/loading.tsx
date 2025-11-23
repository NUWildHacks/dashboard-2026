import { Skeleton } from "@/components/ui/skeleton";

export default async function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <Skeleton className="lg:flex-1 h-[180px] lg:h-[120px]" />
        <div className="flex-1 flex flex-col lg:flex-row gap-4">
          <Skeleton className="lg:flex-1 h-[180px] lg:h-[120px]" />
          <Skeleton className="lg:flex-1 h-[180px] lg:h-[120px]" />
        </div>
      </div>
      <Skeleton className="h-[560px] lg:h-[390px]" />
      <div className="flex flex-col lg:flex-row gap-4">
        <Skeleton className="lg:flex-1 h-[560px] lg:h-[390px]" />
        <Skeleton className="lg:flex-1 h-[560px] lg:h-[390px]" />
      </div>
    </div>
  );
}
