"use client";

import { Loader2, Radio } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MatchedTeam, TeamMatchingRun, TeamMatchingSettings } from "@/types";

import { setResultsReleased } from "../_actions/toggle-results-released.actions";
import type { IntakeEntry } from "../_lib/lib";
import { getRunTeams } from "../_lib/lib";

import { AlgorithmTab } from "./algorithm-tab";
import { EntriesTab } from "./entries-tab";
import { SettingsTab } from "./settings-tab";

type TeamMatchingAdminProps = {
  entries: IntakeEntry[];
  runs: TeamMatchingRun[];
  settings: TeamMatchingSettings;
  resultsReleased: boolean;
};

export const TeamMatchingAdmin = ({ entries, runs, settings, resultsReleased: initialReleased }: TeamMatchingAdminProps) => {
  const [currentRuns, setCurrentRuns] = useState<TeamMatchingRun[]>(runs);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [selectedRunTeams, setSelectedRunTeams] = useState<MatchedTeam[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [released, setReleased] = useState(initialReleased);
  const [togglingRelease, setTogglingRelease] = useState(false);

  const topCount = currentRuns.filter((r) => r.is_top).length;

  const handleRunDeleted = (runId: string) => {
    setCurrentRuns((prev) => prev.filter((r) => r.id !== runId));
    if (selectedRunId === runId) {
      setSelectedRunId(null);
      setSelectedRunTeams([]);
    }
  };

  const handleRunUpdated = (runId: string, patch: Partial<TeamMatchingRun>) => {
    setCurrentRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, ...patch } : r)));
  };

  const handleSelectRun = async (runId: string) => {
    if (runId === selectedRunId) return;
    setSelectedRunId(runId);
    setSelectedRunTeams([]);
    setLoadingTeams(true);
    try {
      const teams = await getRunTeams(runId);
      setSelectedRunTeams(teams);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleToggleRelease = async () => {
    setTogglingRelease(true);
    const next = !released;
    const result = await setResultsReleased(next);
    setTogglingRelease(false);
    if (result.success) {
      setReleased(next);
      toast.success(next ? "Results released to participants" : "Results hidden from participants");
    } else {
      toast.error("Failed to update", { description: result.error });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Release banner */}
      <div className="flex items-center justify-between rounded-lg border p-4 gap-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Participant results</p>
            <Badge variant={released ? "default" : "secondary"}>
              {released ? "Released" : "Hidden"}
            </Badge>
            {topCount > 0 && (
              <span className="text-xs text-muted-foreground">{topCount} run{topCount !== 1 ? "s" : ""} marked as top 3</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {released
              ? "Participants can see their team suggestions from the top-3 runs."
              : "Participants see a 'waiting for results' message. Mark runs as top 3 before releasing."}
          </p>
        </div>
        <Button
          variant={released ? "outline" : "default"}
          onClick={handleToggleRelease}
          disabled={togglingRelease || (!released && topCount === 0)}
          className="shrink-0"
        >
          {togglingRelease ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Radio className="size-4" />
          )}
          {released ? "Unrelease" : "Release results"}
        </Button>
      </div>

      <Tabs defaultValue="algorithm">
        <TabsList className="mb-4">
          <TabsTrigger value="entries">Entries ({entries.length})</TabsTrigger>
          <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="entries">
          <EntriesTab entries={entries} />
        </TabsContent>

        <TabsContent value="algorithm">
          <AlgorithmTab
            runs={currentRuns}
            entryCount={entries.length}
            onRunAdded={(run) => setCurrentRuns((prev) => [run, ...prev])}
            onRunDeleted={handleRunDeleted}
            onRunUpdated={handleRunUpdated}
            teams={selectedRunTeams}
            loadingTeams={loadingTeams}
            selectedRunId={selectedRunId}
            onSelectRun={handleSelectRun}
          />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab settings={settings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
