"use client";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useClipboard from "@/hooks/use-clipboard";
import User from "@/types/user.types";

import useTeamMembersList from "../../_hooks/use-team-members";
import { Project } from "../../_types/project.types";

import TeamMemberItem from "./team-member-item";

type TeamMembersListProps = {
  userId: User["id"];
} & Pick<Project, "id" | "owner_id" | "invitation_code">;

const TeamMembersList = ({ userId, id: projectId, owner_id, invitation_code }: TeamMembersListProps) => {
  const { copied, handleCopy } = useClipboard(invitation_code);

  const { teamMembers, isLoading } = useTeamMembersList(projectId);

  return (
    <Card className="shadow-xs flex-1 min-h-[500px]">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>The following people can collaborate and receive credit for this project</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <>
                <Skeleton className="h-[40px] w-full" />
                <Skeleton className="h-[40px] w-full" />
                <Skeleton className="h-[40px] w-full" />
                <Skeleton className="h-[40px] w-full" />
              </>
            ) : (
              teamMembers.map((teamMember) => (
                <TeamMemberItem key={teamMember.id} userId={userId} projectId={projectId} {...teamMember} />
              ))
            )}
          </div>
        </div>
      </CardContent>
      {userId === owner_id && (
        <CardFooter>
          <div className="flex-1 flex flex-col gap-4">
            <Separator />
            <div className="w-full flex flex-col items-start">
              <p className="text-sm font-semibold">Invitation Code</p>
              <p className="text-sm text-muted-foreground">
                Share your invitation code below to invite your team members. We recommend a team size no larger than 4
                members.
              </p>
            </div>
            <div className="flex justify-center items-center gap-2 flex-nowrap">
              <Input readOnly className="flex-1" value={invitation_code} />
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default TeamMembersList;
