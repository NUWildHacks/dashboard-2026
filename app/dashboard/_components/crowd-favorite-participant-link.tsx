"use client";

import { useState } from "react";

import CrowdFavoriteOptInForm from "@/app/dashboard/crowd-favorite/_components/crowd-favorite-opt-in-form";
import CrowdFavoriteOptedInView from "@/app/dashboard/crowd-favorite/_components/crowd-favorite-opted-in-view";
import CrowdFavoriteVoteForm from "@/app/dashboard/crowd-favorite/_components/crowd-favorite-vote-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { CrowdFavoriteProject } from "@/types";

type VotingProjectOption = {
  id: string;
  project_name: string;
};

type CrowdFavoriteParticipantLinkProps = {
  votingOpen: boolean;
  optInOpen: boolean;
  isOptedIn: boolean;
  callerFirstName: string;
  callerEmail: string;
  crowdFavoriteProject?: CrowdFavoriteProject | null;
  votingProjects?: VotingProjectOption[];
  initialVotedProjectId?: string;
};

const CrowdFavoriteParticipantLink = ({
  votingOpen,
  optInOpen,
  isOptedIn,
  callerFirstName,
  callerEmail,
  crowdFavoriteProject,
  votingProjects = [],
  initialVotedProjectId,
}: CrowdFavoriteParticipantLinkProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const title = votingOpen ? "Crowd Favorite Voting" : "Crowd Favorite Opt-in";

  const description = votingOpen
    ? initialVotedProjectId
      ? "You've cast a vote. You can update your selection while voting is open."
      : "Voting is currently active. Submit or edit your vote now."
    : isOptedIn
      ? "Your team is currently opted in. View or manage your submission."
      : "Opt-in is currently active. Submit your team details to participate.";

  const buttonLabel = votingOpen
    ? initialVotedProjectId
      ? "Update vote"
      : "Cast vote"
    : isOptedIn
      ? "View details"
      : "Opt in";

  const statusBadge = votingOpen ? (
    initialVotedProjectId ? (
      <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
        Voted
      </Badge>
    ) : (
      <Badge variant="outline">Not voted</Badge>
    )
  ) : optInOpen ? (
    isOptedIn ? (
      <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
        Opted in
      </Badge>
    ) : (
      <Badge variant="outline">Not opted in</Badge>
    )
  ) : null;

  return (
    <>
      <Card className="shadow-xs h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle>{title}</CardTitle>
            {statusBadge}
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <Button onClick={() => setIsDialogOpen(true)}>{buttonLabel} &rarr;</Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-0">
          {votingOpen ? (
            <CrowdFavoriteVoteForm projects={votingProjects} initialVotedProjectId={initialVotedProjectId} />
          ) : isOptedIn && crowdFavoriteProject ? (
            <CrowdFavoriteOptedInView crowdFavoriteProject={crowdFavoriteProject} canOptOut={optInOpen} />
          ) : (
            <CrowdFavoriteOptInForm callerFirstName={callerFirstName} callerEmail={callerEmail} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CrowdFavoriteParticipantLink;
