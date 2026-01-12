import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const SettingsLoading = async () => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">General</h2>
        <Separator />
        <Skeleton className="h-[100px] lg:h-[80px]" />
        <Skeleton className="h-[100px] lg:h-[80px]" />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-md font-semibold">Profile</h2>
        <Separator />
        <Skeleton className="h-[600px]" />
      </div>
    </div>
  );
};

export default SettingsLoading;
