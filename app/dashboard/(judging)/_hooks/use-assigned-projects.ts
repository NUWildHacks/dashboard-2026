import { useMemo } from "react";

import { UseFiltersReturn } from "@/hooks";

import { ProjectWithMetadata, Track } from "../types";

export type UseAssignedProjectsSettings = {
  category?: UseFiltersReturn<Track>["category"];
  search?: UseFiltersReturn<Track>["search"];
};

export type UseAssignedProjectsReturn = {
  filteredProjectsWithMetadata: ProjectWithMetadata[];
};

export const useAssignedProjects = (
  projectsWithMetadata: ProjectWithMetadata[],
  settings: UseAssignedProjectsSettings
): UseAssignedProjectsReturn => {
  const { category, search } = settings;

  const filteredProjectsWithMetadata = useMemo(() => {
    let result = projectsWithMetadata;

    if (category && category !== "all") {
      result = result.filter((projectWithMetadata) => projectWithMetadata.track === category);
    }

    if (search && search !== "") {
      const searchLower = search.toLowerCase();
      result = result.filter((projectWithMetadata) => {
        return (
          projectWithMetadata.name.toLowerCase().includes(searchLower) ||
          projectWithMetadata.track.toLowerCase().includes(searchLower)
        );
      });
    }

    return result;
  }, [projectsWithMetadata, category, search]);

  return {
    filteredProjectsWithMetadata,
  };
};
