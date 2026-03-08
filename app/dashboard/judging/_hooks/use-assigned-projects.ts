import { useMemo } from "react";

import { UseFiltersReturn } from "@/hooks";

import { ProjectWithJudgingForm, Track } from "../types";

export type UseAssignedProjectsSettings = {
  category?: UseFiltersReturn<Track>["category"];
  search?: UseFiltersReturn<Track>["search"];
};

export type UseAssignedProjectsReturn = {
  filteredProjectsWithJudgingForm: ProjectWithJudgingForm[];
};

export const useAssignedProjects = (
  projectsWithJudgingForm: ProjectWithJudgingForm[],
  settings: UseAssignedProjectsSettings
): UseAssignedProjectsReturn => {
  const { category, search } = settings;

  const filteredProjectsWithJudgingForm = useMemo(() => {
    let result = projectsWithJudgingForm;

    if (category && category !== "all") {
      result = result.filter((projectWithJudgingForm) => projectWithJudgingForm.track === category);
    }

    if (search && search !== "") {
      const searchLower = search.toLowerCase();
      result = result.filter((projectWithJudgingForm) => {
        return (
          projectWithJudgingForm.name.toLowerCase().includes(searchLower) ||
          projectWithJudgingForm.track.toLowerCase().includes(searchLower)
        );
      });
    }

    return result;
  }, [projectsWithJudgingForm, category, search]);

  return {
    filteredProjectsWithJudgingForm,
  };
};
