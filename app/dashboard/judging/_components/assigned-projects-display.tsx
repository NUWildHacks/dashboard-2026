import { Project } from "../types";

import { AssignedProjectItem } from ".";

type AssignedProjectsDisplayProps = {
  assignedProjects: Project[];
};

const AssignedProjectsDisplay = ({ assignedProjects }: AssignedProjectsDisplayProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {
        assignedProjects.map((project) => (
          <AssignedProjectItem key={project.id} {...project} />
        ))
      }
    </div>
  );
};

export default AssignedProjectsDisplay;
