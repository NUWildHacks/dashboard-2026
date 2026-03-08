import { BookX } from "lucide-react";

import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

import { UseJudgingFormSheetReturn } from "../_hooks";
import { ProjectWithJudgingForm } from "../types";

import { AssignedProjectItem } from ".";

type AssignedProjectGridProps = {
  handleOpenJudgingForm: UseJudgingFormSheetReturn["handleOpenJudgingForm"];
  projectsWithJudgingForm: ProjectWithJudgingForm[];
};

const AssignedProjectGrid = ({ handleOpenJudgingForm, projectsWithJudgingForm }: AssignedProjectGridProps) => {
  if (projectsWithJudgingForm.length === 0) {
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
      {projectsWithJudgingForm.map((projectWithJudgingForm) => (
        <AssignedProjectItem
          key={projectWithJudgingForm.id}
          handleOpenJudgingForm={handleOpenJudgingForm}
          projectWithJudgingForm={projectWithJudgingForm}
        />
      ))}
    </div>
  );
};

export default AssignedProjectGrid;
