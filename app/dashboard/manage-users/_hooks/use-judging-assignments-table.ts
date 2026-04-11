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

import { useFilters, UseFiltersReturnWithAll } from "@/hooks";
import { JudgeUser } from "@/types";

import { uploadAssignments } from "../_actions";
import { getJudgingAssignmentsColumns } from "../_lib/client";
import { judgingAssignmentsCsvArraySchema } from "../_schemas";
import { JudgingAssignment, JudgingAssignmentWithProject, Project } from "../../judging/types";

export type UseJudgingAssignmentsTableReturn = {
  selectedJudge: JudgeUser | null;
  setSelectedJudge: (judgeUser: JudgeUser | null) => void;
  search: UseFiltersReturnWithAll<"round-1" | "round-2">["search"];
  setSearch: UseFiltersReturnWithAll<"round-1" | "round-2">["setSearch"];
  round: UseFiltersReturnWithAll<"round-1" | "round-2">["category"];
  setRound: UseFiltersReturnWithAll<"round-1" | "round-2">["setCategory"];
  table: Table<JudgingAssignmentWithProject>;
  judgingAssignmentsColumns: ColumnDef<JudgingAssignmentWithProject>[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleUploadAssignments: () => void;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const useJudgingAssignmentsTable = (
  judgingAssignments: JudgingAssignment[],
  projects: Project[]
): UseJudgingAssignmentsTableReturn => {
  const {
    category: round,
    setCategory: setRound,
    search,
    setSearch,
  } = useFilters<"round-1" | "round-2">({ includeAll: true });

  const [selectedJudge, setSelectedJudge] = useState<JudgeUser | null>(null);
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

          console.error(parseResult.error);

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

  const projectMap: Map<Project["id"], Project> = useMemo(() => {
    return new Map(projects.map((project) => [project.id, project]));
  }, [projects]);

  const judgingAssignmentsForSelectedJudge: JudgingAssignmentWithProject[] = useMemo(() => {
    if (!selectedJudge) return [];

    let result: JudgingAssignmentWithProject[] = judgingAssignments
      .filter((assignment) => (round === "round-1" ? assignment.judging_round === 1 : assignment.judging_round === 2))
      .filter((assignment) => assignment.judge_id === selectedJudge?.id)
      .map((assignment) => ({
        ...assignment,
        project: projectMap.get(assignment.project_id) as Project,
      })) as JudgingAssignmentWithProject[];

    if (search && search !== "") {
      const searchLower = search.toLowerCase();
      result = result.filter((judgingAssignmentWithProject) => {
        return (
          judgingAssignmentWithProject.project.name.toLowerCase().includes(searchLower) ||
          judgingAssignmentWithProject.project.track.toLowerCase().includes(searchLower) ||
          judgingAssignmentWithProject.project.devpost_url.toLowerCase().includes(searchLower)
        );
      });
    }

    return result;
  }, [selectedJudge, judgingAssignments, projectMap, search, round]);

  const judgingAssignmentsColumns = getJudgingAssignmentsColumns();

  const table = useReactTable({
    data: judgingAssignmentsForSelectedJudge,
    columns: judgingAssignmentsColumns,
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
    round,
    setRound,
    table,
    judgingAssignmentsColumns,
    fileInputRef,
    handleUploadAssignments,
    handleFileChange,
  };
};
