import { Skeleton } from "@/components/ui/skeleton";
import { getVisibleCalendarRows } from "@/lib/calendar";
import { cn } from "@/lib/utils";

const ScheduleLoading = async () => {
  const visibleCalendarRows = getVisibleCalendarRows([]);

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Skeleton className="md:flex-1 max-w-[400px] w-full h-9" />
        <Skeleton className="md:flex-1 max-w-[350px] w-full h-9" />
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
              <p className="absolute top-0 m-0 w-full text-right -translate-y-1/2">{label}</p>
            </div>
            <div className="h-full border-t border-dashed" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleLoading;
