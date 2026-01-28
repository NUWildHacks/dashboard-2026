import { Skeleton } from "@/components/ui/skeleton";

const PermissionCodesLoading = async () => {
  return (
    <div
      className="flex-1 flex flex-col gap-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading permission codes"
    >
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full h-[24px]" />
        <Skeleton className="h-[400px]" />
        <Skeleton className="w-full h-[40px]" />
      </div>
    </div>
  );
};

export default PermissionCodesLoading;
