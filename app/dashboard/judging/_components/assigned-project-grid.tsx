import { BookX } from "lucide-react";

import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

import { UseJudgingFormSheetReturn } from "../_hooks";
import type { JudgingAssignmentWithProject } from "../types";

import { AssignedProjectItem } from ".";

type AssignedProjectGridProps = {
  judgingAssignmentsWithProjects: JudgingAssignmentWithProject[];
} & Pick<UseJudgingFormSheetReturn, "handleOpenJudgingForm" | "handleKeyDown">;

const AssignedProjectGrid = ({
  judgingAssignmentsWithProjects,
  handleOpenJudgingForm,
  handleKeyDown,
}: AssignedProjectGridProps) => {
  if (judgingAssignmentsWithProjects.length === 0) {
    return (
      <Empty role="status" aria-live="polite">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookX aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No assigned projects</EmptyTitle>
          <EmptyDescription>Could not find projects assigned to you. Check back later!</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {judgingAssignmentsWithProjects.map((judgingAssignmentWithProject) => (
        <AssignedProjectItem
          key={judgingAssignmentWithProject.id}
          handleOpenJudgingForm={handleOpenJudgingForm}
          handleKeyDown={handleKeyDown}
          judgingAssignmentWithProject={judgingAssignmentWithProject}
        />
      ))}
    </div>
  );
};

export default AssignedProjectGrid;
