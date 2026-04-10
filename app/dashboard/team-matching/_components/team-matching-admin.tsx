"use client";

import { Loader2, Radio } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MatchedTeam, TeamFormation, TeamMatchingMode, TeamMatchingRun, TeamMatchingSettings } from "@/types";

import { setTeamMatchingMode } from "../_actions/set-mode.actions";
import { setResultsReleased } from "../_actions/toggle-results-released.actions";
import type { IntakeEntry } from "../_lib/lib";
import { getRuns, getRunFormations, getRunTeams, getIntakeEntries } from "../_lib/lib";

import { AlgorithmTab } from "./algorithm-tab";
import { EntriesTab } from "./entries-tab";
import { SettingsTab } from "./settings-tab";

type TeamMatchingAdminProps = {
  entries: IntakeEntry[];
  runs: TeamMatchingRun[];
  settings: TeamMatchingSettings;
  resultsReleased: boolean;
  initialMode: TeamMatchingMode;
};

export const TeamMatchingAdmin = ({
  entries,
  runs,
  settings,
  resultsReleased: initialReleased,
  initialMode,
}: TeamMatchingAdminProps) => {
  const [currentEntries, setCurrentEntries] = useState(entries);
  const [currentRuns, setCurrentRuns] = useState<TeamMatchingRun[]>(runs);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [selectedRunTeams, setSelectedRunTeams] = useState<MatchedTeam[]>([]);
  const [selectedRunFormations, setSelectedRunFormations] = useState<TeamFormation[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [released, setReleased] = useState(initialReleased);
  const [togglingRelease, setTogglingRelease] = useState(false);
  const [showReleaseConfirm, setShowReleaseConfirm] = useState(false);
  const [mode, setMode] = useState<TeamMatchingMode>(initialMode);
  const [changingMode, setChangingMode] = useState(false);

  const [activeTab, setActiveTab] = useState<"entries" | "algorithm" | "settings">("algorithm");

  const topCount = currentRuns.filter((r) => r.is_top).length;

  const fingerprintDuplicates = new Map<string, string[]>();
  const fpToRuns = new Map<string, typeof currentRuns>();
  for (const run of currentRuns) {
    if (!run.fingerprint) continue;
    const group = fpToRuns.get(run.fingerprint) ?? [];
    group.push(run);
    fpToRuns.set(run.fingerprint, group);
  }
  for (const [, group] of fpToRuns) {
    if (group.length <= 1) continue;
    for (const run of group) {
      fingerprintDuplicates.set(
        run.id,
        group.filter((r) => r.id !== run.id).map((r) => r.name || new Date(r.run_at).toLocaleString("en-US"))
      );
    }
  }

  const handleRunDeleted = (runId: string) => {
    setCurrentRuns((prev) => prev.filter((r) => r.id !== runId));
    if (selectedRunId === runId) {
      setSelectedRunId(null);
      setSelectedRunTeams([]);
      setSelectedRunFormations([]);
    }
  };

  const handleRunUpdated = (runId: string, patch: Partial<TeamMatchingRun>) => {
    setCurrentRuns((prev) => prev.map((r) => (r.id === runId ? { ...r, ...patch } : r)));
  };

  const handleSelectRun = async (runId: string) => {
    if (runId === selectedRunId) return;
    setSelectedRunId(runId);
    setSelectedRunTeams([]);
    setSelectedRunFormations([]);
    setLoadingTeams(true);
    try {
      const [teams, formations] = await Promise.all([getRunTeams(runId, mode), getRunFormations(runId, mode)]);
      setSelectedRunTeams(teams);
      setSelectedRunFormations(formations);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleModeChange = async (next: TeamMatchingMode) => {
    setChangingMode(true);
    const [result, newRuns, newEntries] = await Promise.all([
      setTeamMatchingMode(next),
      getRuns(next),
      getIntakeEntries(next),
    ]);
    setChangingMode(false);
    if (result.success) {
      setMode(next);
      setCurrentEntries(newEntries);
      setCurrentRuns(newRuns);
      setReleased(false);
      setSelectedRunId(null);
      setSelectedRunTeams([]);
      setSelectedRunFormations([]);
      toast.success(
        next === "prod" ? "Switched to prod — using live intake data" : "Switched to dev — using test intake data"
      );
    } else {
      toast.error("Failed to switch mode", { description: result.error });
    }
  };

  const handleToggleRelease = async () => {
    setTogglingRelease(true);
    const next = !released;
    const result = await setResultsReleased(next, mode);
    setTogglingRelease(false);
    if (result.success) {
      setReleased(next);
      if (mode === "prod") {
        toast.success(next ? "Results released to participants" : "Results hidden from participants");
      } else {
        toast.success(next ? "Results released (admin preview only)" : "Admin preview hidden");
      }
    } else {
      toast.error("Failed to update", { description: result.error });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="mb-4">
          <TabsTrigger value="entries">Entries ({currentEntries.length})</TabsTrigger>
          <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" forceMount hidden={activeTab !== "entries"}>
          <EntriesTab entries={currentEntries} />
        </TabsContent>

        <TabsContent value="algorithm" forceMount hidden={activeTab !== "algorithm"}>
          {/* Mode + release banner */}
          <div className="flex items-center justify-between rounded-lg border p-4 gap-4 mb-6">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Participant results</p>
                <Badge variant={released ? "default" : "secondary"}>{released ? "Released" : "Hidden"}</Badge>
                {topCount > 0 && <span className="text-xs text-muted-foreground">top choice marked</span>}
              </div>
              <p className="text-xs text-muted-foreground">
                {mode === "dev"
                  ? released
                    ? "Admin preview active — participants cannot see results yet."
                    : "Dev mode: release shows a preview visible to admins only."
                  : released
                    ? "Participants can see their team suggestions from the top choice run."
                    : "Participants see a 'waiting for results' message. Mark a run as top choice before releasing."}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Select
                value={mode}
                onValueChange={(v) => handleModeChange(v as TeamMatchingMode)}
                disabled={changingMode}
              >
                <SelectTrigger className="w-24 h-9">
                  {changingMode ? <Loader2 className="size-3.5 animate-spin" /> : <SelectValue />}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev">Dev</SelectItem>
                  <SelectItem value="prod">Prod</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={released ? "outline" : "default"}
                onClick={() => {
                  if (mode === "prod" && !released) {
                    setShowReleaseConfirm(true);
                  } else {
                    handleToggleRelease();
                  }
                }}
                disabled={togglingRelease || (!released && topCount === 0)}
              >
                {togglingRelease ? <Loader2 className="size-4 animate-spin" /> : <Radio className="size-4" />}
                {released ? "Unrelease" : "Release results"}
              </Button>

              <Dialog open={showReleaseConfirm} onOpenChange={setShowReleaseConfirm}>
                <DialogContent showCloseButton={false}>
                  <DialogHeader>
                    <DialogTitle>Release results to participants?</DialogTitle>
                    <DialogDescription>
                      This will make team suggestions visible to all participants using the top choice run. Make sure
                      the top choice run is finalized before releasing.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowReleaseConfirm(false)} disabled={togglingRelease}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        setShowReleaseConfirm(false);
                        handleToggleRelease();
                      }}
                      disabled={togglingRelease}
                    >
                      Release
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <AlgorithmTab
            runs={currentRuns}
            mode={mode}
            entryCount={currentEntries.length}
            onRunAdded={(run) => setCurrentRuns((prev) => [run, ...prev])}
            onRunDeleted={handleRunDeleted}
            onRunUpdated={handleRunUpdated}
            teams={selectedRunTeams}
            formations={selectedRunFormations}
            loadingTeams={loadingTeams}
            selectedRunId={selectedRunId}
            onSelectRun={handleSelectRun}
            resultsReleased={released}
            atTopLimit={topCount >= 1}
            fingerprintDuplicates={fingerprintDuplicates}
          />
        </TabsContent>

        <TabsContent value="settings" forceMount hidden={activeTab !== "settings"}>
          <SettingsTab settings={settings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
