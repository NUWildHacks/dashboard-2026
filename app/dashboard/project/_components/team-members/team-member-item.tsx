import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import User from "@/types/user.types";

import { TeamMember } from "../../_hooks/use-team-members";
import { Project } from "../../_types/project.types";

type TeamMemberItemProps = {
  userId: User["id"];
  ownerId: Project["owner_id"];
} & TeamMember;

const TeamMemberItem = ({ ownerId, id, first_name, last_name, github_username }: TeamMemberItemProps) => {
  return (
    <div className="flex gap-4 justify-start items-center">
      <Avatar className="size-10">
        <AvatarFallback>{first_name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-semibold truncate">
          {first_name} {last_name}
        </p>
        <p className="text-sm text-muted-foreground truncate">{github_username}</p>
      </div>
    </div>
  );
};

export default TeamMemberItem;
