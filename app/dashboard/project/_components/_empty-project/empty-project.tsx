import { FolderX } from "lucide-react";
import Link from "next/link";

import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { DASHBOARD_SUPPORT_PATH } from "@/constants";

import { CreateProjectDialog, JoinProjectDialog } from "..";

const EmptyProject = () => {
  return (
    <div className="flex-1 flex justify-center items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderX />
          </EmptyMedia>
          <EmptyTitle>No project found</EmptyTitle>
          <EmptyDescription>
            We could not find your project. Please create a new project or join an existing one. If this is a mistake,{" "}
            <Link href={DASHBOARD_SUPPORT_PATH} className="underline underline-offset-4">
              reach out for support
            </Link>
            !
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center">
          <CreateProjectDialog />
          <JoinProjectDialog />
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default EmptyProject;
