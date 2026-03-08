import { Skeleton } from "@/components/ui/skeleton";

const JudgingLoading = async () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading judging"
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} className="h-[85px]" />
      ))}
    </div>
  );
};

export default JudgingLoading;
