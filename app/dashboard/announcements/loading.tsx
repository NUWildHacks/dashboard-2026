import { Skeleton } from "@/components/ui/skeleton";

const AnnouncementsLoading = async () => {
  return (
    <div
      className="flex-1 flex flex-col gap-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading announcements"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Skeleton className="w-full h-9" />
      </div>
      <div className="flex flex-col justify-start items-center gap-4">
        <Skeleton className="h-[80px] w-full" />
        <Skeleton className="h-[80px] w-full" />
        <Skeleton className="h-[80px] w-full" />
      </div>
    </div>
  );
};

export default AnnouncementsLoading;
