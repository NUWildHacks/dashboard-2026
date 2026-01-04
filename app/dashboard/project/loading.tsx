import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectLoading = async () => {
  return (
    <div className="flex-1 flex flex-col lg:flex-row lg:items-start gap-4">
      <Card className="shadow-xs flex-1">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[200px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-5" />
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-7">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-9" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-16" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-9" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-9" />
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-xs flex-1 min-h-[500px]">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-[200px]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-5" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-full flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
              <Skeleton className="h-[40px] w-full" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex-1 flex flex-col gap-4">
            <Separator />
            <div className="w-full flex flex-col items-start gap-2">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-5 w-full" />
            </div>
            <div className="flex justify-center items-center gap-2 flex-nowrap">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="size-9" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectLoading;
