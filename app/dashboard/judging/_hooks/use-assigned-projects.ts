import { useMemo } from "react";

import { UseFiltersReturnWithoutAll } from "@/hooks";

import { JudgingAssignmentWithProject, Track } from "../types";

export type UseAssignedProjectsSettings = {
  search?: UseFiltersReturnWithoutAll<Track>["search"];
};

export type UseAssignedProjectsReturn = {
  filteredJudgingAssignmentsWithProject: JudgingAssignmentWithProject[];
};

export const useAssignedProjects = (
  judgingAssignmentsWithProject: JudgingAssignmentWithProject[],
  settings: UseAssignedProjectsSettings
): UseAssignedProjectsReturn => {
  const { search } = settings;

  const filteredJudgingAssignmentsWithProject = useMemo(() => {
    let result = judgingAssignmentsWithProject;

    if (search && search !== "") {
      const searchLower = search.toLowerCase();
      result = result.filter((judgingAssignmentWithProject) => {
        return (
          judgingAssignmentWithProject.project.name.toLowerCase().includes(searchLower) ||
          judgingAssignmentWithProject.project.track.toLowerCase().includes(searchLower)
        );
      });
    }

    return result;
  }, [judgingAssignmentsWithProject, search]);

  return {
    filteredJudgingAssignmentsWithProject,
  };
};
