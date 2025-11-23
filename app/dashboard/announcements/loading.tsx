import { Skeleton } from "@/components/ui/skeleton";

export default async function AnnouncementsLoading() {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Skeleton className="md:flex-1 max-w-[292px] w-full h-9" />
        <Skeleton className="md:flex-1 max-w-[350px] w-full h-9" />
      </div>
      <div className="flex flex-col justify-start items-center gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
