"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import Papa from "papaparse";
import { ChangeEvent, RefObject, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { JudgeUser } from "@/types";

import { uploadAssignments } from "../_actions";
import { getProjectsColumns } from "../_lib/client";
import { judgingAssignmentsCsvArraySchema } from "../_schemas";
import { JudgingAssignment, ProjectWithMetadata } from "../../judging/types";

export type UseJudgingAssignmentsTableReturn = {
  selectedJudge: JudgeUser | null;
  setSelectedJudge: (judgeUser: JudgeUser | null) => void;
  search: string;
  setSearch: (search: string) => void;
  table: Table<ProjectWithMetadata>;
  projectsColumns: ColumnDef<ProjectWithMetadata>[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleUploadAssignments: () => void;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const useJudgingAssignmentsTable = (
  judgingAssignments: JudgingAssignment[],
  projectsWithMetadata: ProjectWithMetadata[]
): UseJudgingAssignmentsTableReturn => {
  const [selectedJudge, setSelectedJudge] = useState<JudgeUser | null>(null);
  const [search, setSearch] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadAssignments = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const parseResult = judgingAssignmentsCsvArraySchema.safeParse(results.data);

          if (!parseResult.success) {
            toast.error("Invalid CSV file. Please check the columns and try again.");
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            return;
          }

          try {
            const result = await uploadAssignments(parseResult.data);
            const { success } = result;

            if (!success) {
              const { error } = result;
              throw new Error(error);
            }

            toast.success("Assignments uploaded successfully");
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            console.error("Failed to upload assignments", errorMessage);

            toast.error("Failed to upload assignments", { description: errorMessage });
          } finally {
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        },
        error: (error) => {
          console.error("Failed to parse CSV file", error.message);

          toast.error("Failed to parse CSV file", {
            description: error.message,
          });

          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
      });
    }
  };

  const filteredProjects = useMemo(() => {
    if (!selectedJudge) return [];

    const assignedProjectIdsForSelectedJudge = judgingAssignments
      .filter((assignment) => assignment.judge_id === selectedJudge?.id)
      .map((assignment) => assignment.project_id);

    let result = projectsWithMetadata;
    result = result.filter((projectWithMetadata) =>
      assignedProjectIdsForSelectedJudge.includes(projectWithMetadata.id)
    );

    if (search && search !== "") {
      const searchLower = search.toLowerCase();
      result = result.filter((projectWithMetadata) => {
        return (
          projectWithMetadata.name.toLowerCase().includes(searchLower) ||
          projectWithMetadata.track.toLowerCase().includes(searchLower) ||
          projectWithMetadata.project_url.toLowerCase().includes(searchLower)
        );
      });
    }

    return result;
  }, [selectedJudge, judgingAssignments, projectsWithMetadata, search]);

  const projectsColumns = getProjectsColumns();

  const table = useReactTable({
    data: filteredProjects,
    columns: projectsColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    state: {
      sorting,
      columnFilters,
    },
  });

  return {
    selectedJudge,
    setSelectedJudge,
    search,
    setSearch,
    table,
    projectsColumns,
    fileInputRef,
    handleUploadAssignments,
    handleFileChange,
  };
};
