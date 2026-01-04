"use client";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useClipboard from "@/hooks/use-clipboard";
import User from "@/types/user.types";

import useTeamMembersList from "../../_hooks/use-team-members";
import { Project } from "../../_types/project.types";

import TeamMemberItem from "./team-member-item";

type TeamMembersListProps = {
  userId: User["id"];
} & Pick<Project, "id" | "owner_id" | "invitation_code">;

const TeamMembersList = ({ userId, id, owner_id, invitation_code }: TeamMembersListProps) => {
  const { copied, handleCopy } = useClipboard(invitation_code);

  const { teamMembers, isLoading } = useTeamMembersList(id);

  return (
    <Card className="basis-[400px] shrink-0">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Share your invitation code below to invite your team members. We recommend a team size no larger than 4
          members.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
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
              <TeamMemberItem key={teamMember.id} userId={userId} ownerId={owner_id} {...teamMember} />
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex-1 flex items-center">
          <div className="w-full flex flex-col items-start">
            <p className="text-sm font-semibold">Invitation Code</p>
            <p className="text-sm text-muted-foreground">{invitation_code}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            {copied ? <Check /> : <Copy />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TeamMembersList;
