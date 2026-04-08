import { useMemo } from "react";

import { UseFiltersReturnWithoutAll } from "@/hooks";

import { ProjectWithMetadata, Track } from "../types";

export type UseAssignedProjectsSettings = {
  search?: UseFiltersReturnWithoutAll<Track>["search"];
};

export type UseAssignedProjectsReturn = {
  filteredProjectsWithMetadata: ProjectWithMetadata[];
};

export const useAssignedProjects = (
  projectsWithMetadata: ProjectWithMetadata[],
  settings: UseAssignedProjectsSettings
): UseAssignedProjectsReturn => {
  const { search } = settings;

  const filteredProjectsWithMetadata = useMemo(() => {
    let result = projectsWithMetadata;

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
  }, [projectsWithMetadata, search]);

  return {
    filteredProjectsWithMetadata,
  };
};
