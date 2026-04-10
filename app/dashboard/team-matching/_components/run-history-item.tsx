"use client";

import { ChevronDown, ChevronUp, Loader2, Pencil, Star, TriangleAlert, X, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib";
import type { TeamMatchingRun } from "@/types";

import { deleteRun } from "../_actions/delete-run.actions";
import { renameRun } from "../_actions/rename-run.actions";
import { toggleTopRun } from "../_actions/toggle-top-run.actions";

type RunHistoryItemProps = {
  run: TeamMatchingRun;
  isSelected?: boolean;
  onSelect?: () => void;
  onDeleted: (runId: string) => void;
  onUpdated: (runId: string, patch: Partial<TeamMatchingRun>) => void;
};

export const RunHistoryItem = ({ run, isSelected, onSelect, onDeleted, onUpdated }: RunHistoryItemProps) => {
  const [deleting, setDeleting] = useState(false);
  const [togglingTop, setTogglingTop] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(run.name ?? "");
  const [savingName, setSavingName] = useState(false);

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

  const handleToggleTop = async () => {
    setTogglingTop(true);
    const next = !run.is_top;
    const result = await toggleTopRun(run.id, next);
    setTogglingTop(false);
    if (result.success) {
      onUpdated(run.id, { is_top: next });
      toast.success(next ? "Marked as top 3" : "Removed from top 3");
    } else {
      toast.error("Failed to update", { description: result.error });
    }
  };

  const handleSaveName = async () => {
    setSavingName(true);
    const result = await renameRun(run.id, nameInput);
    setSavingName(false);
    if (result.success) {
      onUpdated(run.id, { name: nameInput.trim() });
      setEditing(false);
      toast.success("Run renamed");
    } else {
      toast.error("Failed to rename", { description: result.error });
    }
  };

  const handleCancelEdit = () => {
    setNameInput(run.name ?? "");
    setEditing(false);
  };

  const warningCount = run.warnings?.length ?? 0;
  const displayName = run.name || new Date(run.run_at).toLocaleString();

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border transition-colors",
        isSelected && "border-primary bg-accent/30",
        onSelect && !isSelected && "cursor-pointer hover:bg-accent/20",
      )}
    >
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-3 p-4"
        role={onSelect ? "button" : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onClick={onSelect}
        onKeyDown={onSelect ? (e) => { if (e.key === "Enter" || e.key === " ") onSelect(); } : undefined}
      >
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {/* Name row */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {editing ? (
              <>
                <Input
                  autoFocus
                  className="h-6 text-sm py-0 px-2 w-40"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveName();
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                />
                <button onClick={handleSaveName} disabled={savingName} className="text-muted-foreground hover:text-foreground">
                  {savingName ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                </button>
                <button onClick={handleCancelEdit} className="text-muted-foreground hover:text-foreground">
                  <X className="size-3.5" />
                </button>
              </>
            ) : (
              <>
                <span className="text-sm font-medium truncate">{displayName}</span>
                <button
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setEditing(true)}
                  title="Rename"
                >
                  <Pencil className="size-3" />
                </button>
              </>
            )}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={run.status === "published" ? "default" : "secondary"} className="capitalize">
              {run.status}
            </Badge>
            {run.is_top && (
              <Badge variant="outline" className="text-amber-600 border-amber-400 gap-1">
                <Star className="size-3 fill-amber-500 text-amber-500" />
                Top 3
              </Badge>
            )}
            {warningCount > 0 && (
              <button
                className="inline-flex items-center gap-1 text-xs text-yellow-600 border border-yellow-400 rounded-full px-2 py-0.5 hover:bg-yellow-50"
                onClick={(e) => { e.stopPropagation(); setShowWarnings((v) => !v); }}
              >
                <TriangleAlert className="size-3" />
                {warningCount} warning{warningCount !== 1 ? "s" : ""}
                {showWarnings ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </button>
            )}
            {run.name && (
              <span className="text-xs text-muted-foreground">{new Date(run.run_at).toLocaleString("en-US")}</span>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {run.stats.total_teams} teams &middot; {run.stats.total_participants} participants &middot;{" "}
            {run.stats.unmatched_count} unmatched
          </p>
        </div>

        <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:shrink-0">
          <Button
            size="sm"
            variant={run.is_top ? "default" : "outline"}
            onClick={(e) => { e.stopPropagation(); handleToggleTop(); }}
            disabled={togglingTop || deleting}
            title={run.is_top ? "Remove from top 3" : "Mark as top 3"}
          >
            {togglingTop ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Star className={cn("size-4", run.is_top && "fill-current")} />
            )}
            {run.is_top ? "Top 3" : "Mark top 3"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            disabled={togglingTop || deleting}
          >
            {deleting ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
          </Button>
        </div>
      </div>

      {showWarnings && warningCount > 0 && (
        <div className="border-t px-4 pb-3 pt-2 flex flex-col gap-1">
          {run.warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-yellow-700">
              <TriangleAlert className="size-3.5 mt-0.5 shrink-0 text-yellow-500" />
              <span>{w.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
