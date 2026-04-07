"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { CrowdFavoriteProjectWithVotes } from "../_lib";

type CrowdFavoriteAdminProjectListProps = {
  projects: CrowdFavoriteProjectWithVotes[];
  showVoteCount: boolean;
};

const CrowdFavoriteAdminProjectList = ({ projects, showVoteCount }: CrowdFavoriteAdminProjectListProps) => {
  const router = useRouter();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      router.refresh();
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [router]);

  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No crowd favorite projects yet</CardTitle>
          <CardDescription>Projects will appear here as teams opt in during the intake window.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {projects.map((project, index) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span>{project.project_name}</span>
              {showVoteCount ? <span className="text-sm font-medium">Votes: {project.vote_count}</span> : null}
            </CardTitle>
            <CardDescription>
              Rank #{index + 1}
              {showVoteCount ? " (sorted by votes)" : " (sorted by earliest opt-in)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <p className="break-all">
              <span className="font-medium">Devpost:</span> {project.devpost_url}
            </p>
            <div>
              <p className="font-medium">Team members</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {project.team_members.map((member) => (
                  <li key={member.id}>
                    {member.first_name} &lt;{member.email}&gt;
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CrowdFavoriteAdminProjectList;
