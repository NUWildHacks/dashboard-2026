"use client";

type CalendarRowProps = {
  start: number;
  end: number;
  label: string;
};

export default function CalendarRow({ start, end, label }: CalendarRowProps) {
  return (
    <div className="w-full h-[80px] grid grid-cols-[50px_1fr] space-x-2">
      <div className="relative text-sm h-full">
        <p className="absolute top m-0 w-full text-right -translate-y-1/2">{label}</p>
      </div>
      <div className="h-full border-t border-dashed" />
    </div>
  );
}
