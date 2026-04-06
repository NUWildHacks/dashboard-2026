import { Skeleton } from "@/components/ui/skeleton";

const CheckInLoading = async () => {
  return (
    <div
      className="flex-1 flex flex-col gap-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading check-in console"
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4 rounded-xl border p-6">
          <Skeleton className="h-6 w-[220px]" />
          <Skeleton className="h-4 w-full max-w-[460px]" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-[72px] w-full" />
          <Skeleton className="h-[360px] w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-3 rounded-xl border p-6">
          <Skeleton className="h-6 w-[140px]" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-[74px] w-full" />
          <Skeleton className="h-[74px] w-full" />
          <Skeleton className="h-[74px] w-full" />
          <Skeleton className="h-[74px] w-full" />
        </div>
      </div>
    </div>
  );
};

export default CheckInLoading;
