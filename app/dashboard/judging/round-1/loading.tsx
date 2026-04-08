import { Skeleton } from "@/components/ui/skeleton";

const JudgingRound1Loading = async () => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading judging"
      className="flex-1 flex flex-col gap-4"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Skeleton className="w-full h-9" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[85px]" />
        ))}
      </div>
    </div>
  );
};

export default JudgingRound1Loading;
