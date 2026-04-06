"use client";

import { Loader2 } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MatchedTeam, TeamMatchingRun } from "@/types";

import { TeamResultCard } from "./team-result-card";

type ResultsTabProps = {
  runs: TeamMatchingRun[];
  teams: MatchedTeam[];
  loadingTeams: boolean;
  onSelectRun: (runId: string) => void;
};

export const ResultsTab = ({ runs, teams, loadingTeams, onSelectRun }: ResultsTabProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Select onValueChange={onSelectRun}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select a run to view results" />
          </SelectTrigger>
          <SelectContent>
            {runs.map((run) => (
              <SelectItem key={run.id} value={run.id}>
                {new Date(run.run_at).toLocaleString()} — {run.status} ({run.stats.total_teams} teams)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {loadingTeams && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
      </div>

      {runs.length === 0 && (
        <p className="text-sm text-muted-foreground">No runs yet. Run the algorithm first.</p>
      )}

      {!loadingTeams && teams.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">{teams.length} teams</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {teams.map((team) => (
              <TeamResultCard key={team.id} team={team} />
            ))}
          </div>
        </>
      )}

      {!loadingTeams && teams.length === 0 && runs.length > 0 && (
        <p className="text-sm text-muted-foreground">Select a run above to view its teams.</p>
      )}
    </div>
  );
};
