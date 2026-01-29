import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib";

import { getVisibleCalendarRows } from "./lib";

const ScheduleLoading = async () => {
  const visibleCalendarRows = getVisibleCalendarRows([], 0);

  return (
    <div
      className="flex-1 flex flex-col gap-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading schedule"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Skeleton className="w-full h-9" />
      </div>
      <div className="w-full flex flex-col py-2">
        {visibleCalendarRows.map(({ start, label }, index) => (
          <div
            key={`${label}-${start}`}
            className={cn(
              "w-full grid grid-cols-[50px_1fr] space-x-2",
              index !== visibleCalendarRows.length - 1 && "h-[80px]"
            )}
          >
            <div className="relative text-sm h-full">
              <Skeleton className="absolute top-0 m-0 w-full h-[20px] -translate-y-1/2" />
            </div>
            <div className="h-full border-t border-dashed" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleLoading;
