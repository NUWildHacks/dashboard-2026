import { DialogClose } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";

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
import User from "@/types/user.types";

import useLeaveProjectDialog from "../../_hooks/use-leave-project-dialog";
import { Project } from "../../_types/project.types";

type LeaveProjectDialogProps = {
  userId: User["id"];
  projectId: Project["id"];
};

const LeaveProjectDialog = ({ userId, projectId }: LeaveProjectDialogProps) => {
  const { handleLeaveProject, isLoading } = useLeaveProjectDialog(userId, projectId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Leave</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            You will need to be reinvited if you still wish to collaborate on this project. Or you can create your own
            project.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button disabled={isLoading} variant="outline">
              Go Back
            </Button>
          </DialogClose>
          <Button disabled={isLoading} variant="destructive" onClick={handleLeaveProject}>
            {isLoading ? <Loader2 /> : "Leave project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveProjectDialog;
