import { Skeleton } from "@/components/ui/skeleton";
import { ONE_DAY } from "@/constants";
import { cn } from "@/lib";

import { getVisibleCalendarRows } from "./lib";

const ScheduleLoading = async () => {
  const defaultStartTime = new Date().getTime();
  const defaultEndTime = defaultStartTime + ONE_DAY;
  const defaultDay = new Date().setHours(0, 0, 0, 0);
  const visibleCalendarRows = getVisibleCalendarRows(
    defaultStartTime,
    defaultEndTime,
    defaultDay,
    defaultDay + ONE_DAY
  );

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
        {visibleCalendarRows.map(({ label }, index) => (
          <div
            key={`${label}-${index}`}
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
