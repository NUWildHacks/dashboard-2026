import { FolderX } from "lucide-react";

import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import type { User } from "@/types";

import CreateProjectDialog from "./create-project-dialog";
import JoinProjectDialog from "./join-project-dialog";

type EmptyProjectProps = {
  userId: User["id"];
};

const EmptyProject = ({ userId }: EmptyProjectProps) => {
  return (
    <div className="flex-1 flex justify-center items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderX />
          </EmptyMedia>
          <EmptyTitle>No project found</EmptyTitle>
          <EmptyDescription>
            We could not find your project. Please create a new project or join an existing one. If this is a mistake,
            reach out for support!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center">
          <CreateProjectDialog userId={userId} />
          <JoinProjectDialog userId={userId} />
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default EmptyProject;
