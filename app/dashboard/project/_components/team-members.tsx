"use client";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useClipboard from "@/hooks/use-clipboard";

import { Project } from "../_types/project.types";

type TeamMembersProps = {
  projectId: Project["id"];
  invitationCode: Project["invitation_code"];
};

const TeamMembers = ({ projectId, invitationCode }: TeamMembersProps) => {
  const { copied, handleCopy } = useClipboard(invitationCode);

  return (
    <Card className="basis-[400px] shrink-0">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Invite your team members to collaborate.</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="mb-4" />
        <div className="flex-1 flex flex-col items-start">
          <div className="w-full flex justify-between items-center">
            <p className="text-sm font-semibold">Invitation Code</p>
            <Button variant="ghost" size="icon-sm" onClick={handleCopy}>
              {copied ? <Check /> : <Copy />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{invitationCode}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMembers;
