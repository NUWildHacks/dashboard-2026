import { BookX } from "lucide-react";

import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

import { ProjectWithMetadata } from "../types";

import { AssignedProjectItem } from ".";

type AssignedProjectGridProps = {
  handleOpenJudgingForm: [];
  projectsWithMetadata: ProjectWithMetadata[];
};

const AssignedProjectGrid = ({ handleOpenJudgingForm, projectsWithMetadata }: AssignedProjectGridProps) => {
  if (projectsWithMetadata.length === 0) {
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
      {projectsWithMetadata.map((projectWithMetadata) => (
        <AssignedProjectItem
          key={projectWithMetadata.id}
          handleOpenJudgingForm={handleOpenJudgingForm}
          projectWithMetadata={projectWithMetadata}
        />
      ))}
    </div>
  );
};

export default AssignedProjectGrid;
