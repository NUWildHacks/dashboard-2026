import { Skeleton } from "@/components/ui/skeleton";

const DashboardLoading = async () => {
  return (
    <div
      className="flex-1 flex flex-col gap-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        <Skeleton className="lg:flex-1 h-[134x]" />
        <div className="flex-1 flex flex-col lg:flex-row gap-4">
          <Skeleton className="lg:flex-1 h-[134px]" />
          <Skeleton className="lg:flex-1 h-[134px]" />
        </div>
      </div>
      <Skeleton className="h-[450px]" />
      <Skeleton className="h-[450px]" />
    </div>
  );
};

export default DashboardLoading;
