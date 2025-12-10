import { CALENDAR_HOURS } from "@/constants/calendar";
import { cn } from "@/lib/utils";

export default async function ScheduleLoading() {
  return (
    <div className="w-full flex flex-col py-2">
      {CALENDAR_HOURS.map(({ start, label }, index) => (
        <div
          key={`${label}-${start}`}
          className={cn(
            "w-full grid grid-cols-[50px_1fr] space-x-2",
            index !== CALENDAR_HOURS.length - 1 && "h-[80px]"
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
}
