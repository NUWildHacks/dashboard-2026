import { DialogClose } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";

import { useLeaveProjectDialog } from "@/app/dashboard/project/_hooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { Project } from "../../types";

type LeaveProjectDialogProps = {
  projectId: Project["id"];
};

const LeaveProjectDialog = ({ projectId }: LeaveProjectDialogProps) => {
  const { handleLeaveProject, isLoading } = useLeaveProjectDialog();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Leave</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            You will need the invitation code from the project owner to join the project again. Or you can create your
            own project.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isLoading} variant="outline">
              Go Back
            </Button>
          </DialogClose>
          <Button disabled={isLoading} variant="destructive" onClick={() => handleLeaveProject(projectId)}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Leave project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveProjectDialog;
