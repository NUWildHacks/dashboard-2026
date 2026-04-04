import { Skeleton } from "@/components/ui/skeleton";

const MentoringLoading = async () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading mentoring"
      className="flex-1 flex flex-col gap-4"
    >
      <Skeleton className="w-full h-[250px]" />
    </div>
  );
};

export default MentoringLoading;
