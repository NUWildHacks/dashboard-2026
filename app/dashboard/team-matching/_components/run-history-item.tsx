"use client";

import { useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TeamMatchingRun } from "@/types";

import { deleteRun } from "../_actions/delete-run.actions";
import { publishRun } from "../_actions/publish-run.actions";

type RunHistoryItemProps = {
  run: TeamMatchingRun;
  onDeleted: (runId: string) => void;
  onPublished: (runId: string) => void;
};

export const RunHistoryItem = ({ run, onDeleted, onPublished }: RunHistoryItemProps) => {
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handlePublish = async () => {
    setPublishing(true);
    const result = await publishRun(run.id);
    setPublishing(false);
    if (result.success) {
      toast.success("Results published");
      onPublished(run.id);
    } else {
      toast.error("Failed to publish", { description: result.error });
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteRun(run.id);
    setDeleting(false);
    if (result.success) {
      toast.success("Run deleted");
      onDeleted(run.id);
    } else {
      toast.error("Failed to delete", { description: result.error });
    }
  };

  const warningCount = run.warnings?.length ?? 0;
  const date = new Date(run.run_at).toLocaleString();

  return (
    <div className="flex items-center justify-between rounded-lg border p-4 gap-4">
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={run.status === "published" ? "default" : "secondary"} className="capitalize">
            {run.status}
          </Badge>
          {warningCount > 0 && (
            <Badge variant="outline" className="text-yellow-600 border-yellow-400 gap-1">
              <TriangleAlert className="size-3" />
              {warningCount} warning{warningCount !== 1 ? "s" : ""}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {run.stats.total_teams} teams &middot; {run.stats.total_participants} participants &middot;{" "}
          {run.stats.unmatched_count} unmatched
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {run.status === "draft" && (
          <>
            <Button size="sm" onClick={handlePublish} disabled={publishing || deleting}>
              {publishing ? <Loader2 className="size-4 animate-spin" /> : "Publish"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleDelete} disabled={publishing || deleting}>
              {deleting ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
