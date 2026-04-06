"use client";

import { TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { MatchedTeam } from "@/types";

const TECHNICAL_ROLES = new Set(["Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "Mobile Engineer"]);

type TeamResultCardProps = {
  team: MatchedTeam;
};

export const TeamResultCard = ({ team }: TeamResultCardProps) => {
  const hasTech = team.members.some((m) => m.roles.some((r) => TECHNICAL_ROLES.has(r)));

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Score</span>
            <div className="flex items-center gap-1.5">
              <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${team.score}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{team.score}</span>
            </div>
          </div>
          {!hasTech && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-400 gap-1 text-xs">
              <TriangleAlert className="size-3" />
              No tech member
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          {team.members.map((member) => (
            <div key={member.user_id} className="flex items-start gap-2">
              <span className="text-sm font-medium min-w-0 truncate">{member.name}</span>
              <div className="flex flex-wrap gap-1 flex-1">
                {member.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="text-xs">
                    {role.replace(" Engineer", "").replace(" Scientist", "")}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {team.match_reasons.length > 0 && (
          <ul className="list-disc pl-4 space-y-0.5">
            {team.match_reasons.map((reason, i) => (
              <li key={i} className="text-xs text-muted-foreground">{reason}</li>
            ))}
          </ul>
        )}

        {team.notes.length > 0 && (
          <div className="rounded-md border border-yellow-400/60 bg-yellow-50 dark:bg-yellow-950/30 p-2">
            {team.notes.map((note, i) => (
              <p key={i} className="text-xs text-yellow-800 dark:text-yellow-300">{note}</p>
            ))}
          </div>
        )}

        {team.where_to_meet && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Meet at:</span> {team.where_to_meet}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
