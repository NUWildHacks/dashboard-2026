"use client";

import { useState } from "react";
import { Loader2, Play, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { TeamMatchingRun } from "@/types";

import { runMatching } from "../_actions/run-matching.actions";
import { RunHistoryItem } from "./run-history-item";

type AlgorithmTabProps = {
  runs: TeamMatchingRun[];
  entryCount: number;
  onRunAdded: (run: TeamMatchingRun) => void;
  onRunDeleted: (runId: string) => void;
  onRunPublished: (runId: string) => void;
};

export const AlgorithmTab = ({ runs, entryCount, onRunAdded, onRunDeleted, onRunPublished }: AlgorithmTabProps) => {
  const [running, setRunning] = useState(false);
  const [preflightWarnings, setPreflightWarnings] = useState<string[]>([]);

  const handleRun = async () => {
    setRunning(true);
    setPreflightWarnings([]);

    const result = await runMatching();
    setRunning(false);

    if (!result.success) {
      toast.error("Matching failed", { description: result.error });
      return;
    }

    toast.success("Matching complete", {
      description: `${result.stats?.total_teams} teams formed${result.warningCount ? ` · ${result.warningCount} warnings` : ""}`,
    });

    // Reload page to get fresh run data (server-rendered)
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Run matching algorithm</p>
            <p className="text-xs text-muted-foreground">{entryCount} intake submissions will be processed</p>
          </div>
          <Button onClick={handleRun} disabled={running || entryCount === 0}>
            {running ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="size-4" />
                Run matching
              </>
            )}
          </Button>
        </div>

        {preflightWarnings.length > 0 && (
          <Alert variant="destructive">
            <TriangleAlert className="size-4" />
            <AlertDescription>
              <p className="font-medium mb-1">Pre-flight issues — resolve before running:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                {preflightWarnings.map((w, i) => (
                  <li key={i} className="text-sm">{w}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Run history</p>
        {runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No runs yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {runs.map((run) => (
              <RunHistoryItem
                key={run.id}
                run={run}
                onDeleted={onRunDeleted}
                onPublished={onRunPublished}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
