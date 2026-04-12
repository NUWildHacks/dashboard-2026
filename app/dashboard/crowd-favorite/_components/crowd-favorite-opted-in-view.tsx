"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { optOutOfCrowdFavorite } from "@/app/dashboard/crowd-favorite/_actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CrowdFavoriteProject } from "@/types";

type CrowdFavoriteOptedInViewProps = {
  crowdFavoriteProject: CrowdFavoriteProject;
  canOptOut: boolean;
};

const CrowdFavoriteOptedInView = ({ crowdFavoriteProject, canOptOut }: CrowdFavoriteOptedInViewProps) => {
  const router = useRouter();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmOptOut = async () => {
    setIsSubmitting(true);

    try {
      const result = await optOutOfCrowdFavorite();

      if (!result.success) {
        toast.error("Could not opt out your team", { description: result.error });
        return;
      }

      toast.success("Team opted out of crowd favorite");
      setIsConfirmDialogOpen(false);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your team is opted in</CardTitle>
          <CardDescription>
            Your project is currently eligible for crowd favorite. Team details are read-only below.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <p>
            <span className="font-medium">Project:</span> {crowdFavoriteProject.project_name}
          </p>
          <p className="break-all">
            <span className="font-medium">Devpost:</span> {crowdFavoriteProject.devpost_url}
          </p>
          <div>
            <p className="font-medium">Team members</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              {crowdFavoriteProject.team_members.map((member) => (
                <li key={member.id}>
                  {member.first_name} &lt;{member.email}&gt;
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          {canOptOut ? (
            <>
              <Button variant="destructive" onClick={() => setIsConfirmDialogOpen(true)}>
                Opt out entire team
              </Button>
              <p className="text-xs text-muted-foreground">
                Your team will be removed as a whole from crowd favorite voting. Team members can opt back in before the
                form closes.
              </p>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Opt-out is closed after the opt-in deadline.</p>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm team opt-out</DialogTitle>
            <DialogDescription>
              This will opt out all listed teammates and remove this project from crowd favorite.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            <p className="font-medium">Affected members</p>
            <ul className="space-y-1 text-muted-foreground">
              {crowdFavoriteProject.team_members.map((member) => (
                <li key={member.id}>
                  {member.first_name} &lt;{member.email}&gt;
                </li>
              ))}
            </ul>
          </div>

          <DialogFooter>
            <Button variant="outline" disabled={isSubmitting} onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isSubmitting} onClick={handleConfirmOptOut}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Confirm opt-out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CrowdFavoriteOptedInView;
