import { LeaveProjectDialog } from "@/app/dashboard/project/_components";
import type { Project, TeamMember } from "@/app/dashboard/project/_types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { User } from "@/types";

type TeamMemberItemProps = {
  userId: User["id"];
  projectId: Project["id"];
} & TeamMember;

const TeamMemberItem = ({
  userId,
  projectId,
  id: teamMemberId,
  first_name,
  last_name,
  github_username,
  email,
}: TeamMemberItemProps) => {
  return (
    <div className="flex gap-4 justify-between items-center">
      <div className="flex gap-4 justify-start items-center">
        <Avatar className="size-10 outline">
          <AvatarFallback>{first_name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="truncate">
          <p className="text-sm font-semibold">
            {first_name} {last_name}
          </p>
          <p className="text-xs text-muted-foreground">
            {github_username} • {email}
          </p>
        </div>
      </div>
      {userId === teamMemberId && <LeaveProjectDialog userId={userId} projectId={projectId} />}
    </div>
  );
};

export default TeamMemberItem;
