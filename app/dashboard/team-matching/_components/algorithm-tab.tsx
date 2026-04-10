"use client";

import { Loader2, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MatchedTeam, TeamFormation, TeamMatchingMode, TeamMatchingRun } from "@/types";

import { runMatching } from "../_actions/run-matching.actions";

import { RunHistoryItem } from "./run-history-item";
import { TeamResultCard } from "./team-result-card";

type AlgorithmTabProps = {
  runs: TeamMatchingRun[];
  mode: TeamMatchingMode;
  entryCount: number;
  onRunAdded: (run: TeamMatchingRun) => void;
  onRunDeleted: (runId: string) => void;
  onRunUpdated: (runId: string, patch: Partial<TeamMatchingRun>) => void;
  teams: MatchedTeam[];
  formations: TeamFormation[];
  loadingTeams: boolean;
  selectedRunId: string | null;
  onSelectRun: (runId: string) => void;
  resultsReleased: boolean;
  atTopLimit: boolean;
  fingerprintDuplicates: Map<string, string[]>;
};

export const AlgorithmTab = ({
  runs,
  mode,
  entryCount,
  onRunAdded,
  onRunDeleted,
  onRunUpdated,
  teams,
  formations,
  loadingTeams,
  selectedRunId,
  onSelectRun,
  resultsReleased,
  atTopLimit,
  fingerprintDuplicates,
}: AlgorithmTabProps) => {
  const [running, setRunning] = useState(false);
  const [runName, setRunName] = useState("");
  const [formationIndex, setFormationIndex] = useState<0 | 1 | 2>(0);

  const handleRun = async () => {
    setRunning(true);
    const result = await runMatching(runName || undefined);
    setRunning(false);

    if (!result.success) {
      toast.error("Matching failed", { description: result.error });
      return;
    }

    toast.success("Matching complete", {
      description: `${result.stats?.total_teams} teams formed${result.warningCount ? ` · ${result.warningCount} warning${result.warningCount !== 1 ? "s" : ""}` : ""}`,
    });

    if (result.run) {
      onRunAdded(result.run);
      onSelectRun(result.run.id);
      setRunName("");
      setFormationIndex(0);
    }
  };

  const handleSelectRun = (runId: string) => {
    setFormationIndex(0);
    onSelectRun(runId);
  };

  const visibleTeams: MatchedTeam[] =
    formationIndex === 0 ? teams : (formations.find((f) => f.formation_index === formationIndex)?.teams ?? []);

  const formationLabels = ["Primary", "Alternative 1", "Alternative 2"] as const;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Run matching algorithm</p>
              <Badge variant="outline" className="text-xs font-mono">
                {mode.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{entryCount} intake submissions in pool</p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              className="flex-1 sm:w-48 sm:flex-none"
              placeholder="Run name (optional)"
              value={runName}
              onChange={(e) => setRunName(e.target.value)}
              disabled={running}
            />
            <Button onClick={handleRun} disabled={running || entryCount === 0} className="shrink-0">
              {running ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span className="hidden sm:inline">Running...</span>
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  <span className="hidden sm:inline">Run matching</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,400px)_1fr] gap-6 min-h-0">
        {/* Left: run list */}
        <div className="flex flex-col gap-2 lg:overflow-y-auto lg:max-h-[65vh] lg:pr-1">
          <p className="text-sm font-medium lg:sticky lg:top-0 bg-background pb-1">Run history</p>
          {runs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No runs yet.</p>
          ) : (
            runs.map((run) => (
              <RunHistoryItem
                key={run.id}
                run={run}
                mode={mode}
                isSelected={run.id === selectedRunId}
                onSelect={() => handleSelectRun(run.id)}
                onDeleted={onRunDeleted}
                onUpdated={onRunUpdated}
                resultsReleased={resultsReleased}
                atTopLimit={atTopLimit}
                duplicateRunNames={fingerprintDuplicates.get(run.id) ?? []}
              />
            ))
          )}
        </div>

        {/* Right: teams for selected run */}
        <div className="flex flex-col gap-3 lg:overflow-y-auto lg:max-h-[65vh]">
          {selectedRunId ? (
            <>
              <div className="sticky top-0 bg-background pb-1 flex items-center justify-between gap-4">
                <p className="text-sm font-medium">
                  {formationLabels[formationIndex]}
                  {!loadingTeams && visibleTeams.length > 0 && (
                    <span className="ml-2 font-normal text-muted-foreground">({visibleTeams.length} teams)</span>
                  )}
                </p>
                {!loadingTeams && (
                  <div className="flex items-center gap-1">
                    {([0, 1, 2] as const).map((i) => (
                      <Button
                        key={i}
                        size="sm"
                        variant={formationIndex === i ? "default" : "outline"}
                        className="h-7 px-2 text-xs"
                        onClick={() => setFormationIndex(i)}
                        disabled={i > 0 && formations.find((f) => f.formation_index === i) === undefined}
                      >
                        {formationLabels[i]}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              {loadingTeams ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Loading teams...
                </div>
              ) : visibleTeams.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {visibleTeams.map((team) => (
                    <TeamResultCard key={team.id} team={team} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No teams found for this formation.</p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground mt-6">Select a run to view its teams.</p>
          )}
        </div>
      </div>
    </div>
  );
};
