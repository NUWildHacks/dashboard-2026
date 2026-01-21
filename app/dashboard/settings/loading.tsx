import { Skeleton } from "@/components/ui/skeleton";

const SettingsLoading = async () => {
  return (
    <div
      className="flex-1 flex flex-col gap-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading settings"
    >
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full h-[24px]" />
        <Skeleton className="h-[100px] lg:h-[80px]" />
        <Skeleton className="h-[100px] lg:h-[80px]" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full h-[24px]" />
        <Skeleton className="h-[600px]" />
      </div>
    </div>
  );
};

export default SettingsLoading;
