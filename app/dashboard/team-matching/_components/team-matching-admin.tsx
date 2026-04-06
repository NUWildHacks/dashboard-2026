"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MatchedTeam, TeamMatchingRun, TeamMatchingSettings } from "@/types";

import type { IntakeEntry } from "../_lib/lib";

import { AlgorithmTab } from "./algorithm-tab";
import { EntriesTab } from "./entries-tab";
import { ResultsTab } from "./results-tab";
import { SettingsTab } from "./settings-tab";

type TeamMatchingAdminProps = {
  entries: IntakeEntry[];
  runs: TeamMatchingRun[];
  settings: TeamMatchingSettings;
};

export const TeamMatchingAdmin = ({ entries, runs, settings }: TeamMatchingAdminProps) => {
  const [currentRuns, setCurrentRuns] = useState<TeamMatchingRun[]>(runs);
  const [selectedRunTeams, setSelectedRunTeams] = useState<MatchedTeam[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  const handleRunAdded = (run: TeamMatchingRun) => {
    setCurrentRuns((prev) => [run, ...prev]);
  };

  const handleRunDeleted = (runId: string) => {
    setCurrentRuns((prev) => prev.filter((r) => r.id !== runId));
    if (selectedRunTeams.length > 0 && selectedRunTeams[0]?.run_id === runId) {
      setSelectedRunTeams([]);
    }
  };

  const handleRunPublished = (runId: string) => {
    setCurrentRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, status: "published" } : r)));
  };

  const handleLoadTeams = async (runId: string) => {
    setLoadingTeams(true);
    try {
      const { getRunTeams } = await import("../_lib/lib");
      const teams = await getRunTeams(runId);
      setSelectedRunTeams(teams);
    } finally {
      setLoadingTeams(false);
    }
  };

  return (
    <Tabs defaultValue="entries">
      <TabsList className="mb-4">
        <TabsTrigger value="entries">Entries ({entries.length})</TabsTrigger>
        <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="entries">
        <EntriesTab entries={entries} />
      </TabsContent>

      <TabsContent value="algorithm">
        <AlgorithmTab
          runs={currentRuns}
          entryCount={entries.length}
          onRunAdded={handleRunAdded}
          onRunDeleted={handleRunDeleted}
          onRunPublished={handleRunPublished}
        />
      </TabsContent>

      <TabsContent value="results">
        <ResultsTab
          runs={currentRuns}
          teams={selectedRunTeams}
          loadingTeams={loadingTeams}
          onSelectRun={handleLoadTeams}
        />
      </TabsContent>

      <TabsContent value="settings">
        <SettingsTab settings={settings} />
      </TabsContent>
    </Tabs>
  );
};
