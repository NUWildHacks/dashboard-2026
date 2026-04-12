import { useMemo } from "react";

import { CategoryWithAll, UseFiltersReturnWithoutAll } from "@/hooks";

import { SUBMITTED_STATUS, NOT_SUBMITTED_STATUS } from "../constants";
import { JudgingAssignmentWithProject, SubmissionStatus } from "../types";

export type UseAssignedProjectsSettings = {
  category?: UseFiltersReturnWithoutAll<CategoryWithAll<SubmissionStatus>>["category"];
  search?: UseFiltersReturnWithoutAll<CategoryWithAll<SubmissionStatus>>["search"];
};

export type UseAssignedProjectsReturn = {
  filteredJudgingAssignmentsWithProject: JudgingAssignmentWithProject[];
};

export const useAssignedProjects = (
  judgingAssignmentsWithProject: JudgingAssignmentWithProject[],
  settings: UseAssignedProjectsSettings
): UseAssignedProjectsReturn => {
  const { category, search } = settings;

  const filteredJudgingAssignmentsWithProject = useMemo(() => {
    let result = judgingAssignmentsWithProject;

    if (category === SUBMITTED_STATUS) {
      result = result.filter((judgingAssignmentWithProject) => judgingAssignmentWithProject.judging_form !== null);
    } else if (category === NOT_SUBMITTED_STATUS) {
      result = result.filter((judgingAssignmentWithProject) => judgingAssignmentWithProject.judging_form === null);
    }

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
  }, [judgingAssignmentsWithProject, category, search]);

  return {
    filteredJudgingAssignmentsWithProject,
  };
};
