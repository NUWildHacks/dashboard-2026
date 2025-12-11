import { FolderX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import User from "@/types/user";
import { WildHacksConfig } from "@/types/wildhacks";

import JoinProjectDialog from "./join-project-dialog";

type EmptyProjectProps = {
  userId: User["id"];
  maxTeamSize: WildHacksConfig["max_team_size"];
};

const EmptyProject = ({ userId, maxTeamSize }: EmptyProjectProps) => {
  return (
    <div className="flex-1 flex justify-center items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderX />
          </EmptyMedia>
          <EmptyTitle>No Project Found</EmptyTitle>
          <EmptyDescription>
            We could not find your project. Please create a new project or join an existing one. If this is a mistake,
            reach out for support!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row">
          <Button>Create new project</Button>
          <JoinProjectDialog userId={userId} maxTeamSize={maxTeamSize} />
        </EmptyContent>
      </Empty>
    </div>
  );
};

export default EmptyProject;
