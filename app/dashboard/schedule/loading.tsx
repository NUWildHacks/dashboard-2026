import { CALENDAR_ROW_INTERVALS } from "@/constants/calendar";
import { cn } from "@/lib/utils";

const ScheduleLoading = async () => {
  return (
    <div className="w-full flex flex-col py-2">
      {CALENDAR_ROW_INTERVALS.map(({ start, label }, index) => (
        <div
          key={`${label}-${start}`}
          className={cn(
            "w-full grid grid-cols-[50px_1fr] space-x-2",
            index !== CALENDAR_ROW_INTERVALS.length - 1 && "h-[80px]"
          )}
        >
          <div className="relative text-sm h-full">
            <p className="absolute top-0 m-0 w-full text-right -translate-y-1/2">{label}</p>
          </div>
          <div className="h-full border-t border-dashed" />
        </div>
      ))}
    </div>
  );
};

export default ScheduleLoading;
