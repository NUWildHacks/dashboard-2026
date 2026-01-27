import { Skeleton } from "@/components/ui/skeleton";

const ManageUsersLoading = async () => {
  return (
    <div className="flex-1 flex flex-col lg:flex-row lg:items-start gap-4">
      <Skeleton className="flex-1 min-h-[525px]" />
      <Skeleton className="flex-1 min-h-[500px]" />
    </div>
  );
};

export default ManageUsersLoading;
