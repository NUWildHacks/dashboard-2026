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

import { useFilters, UseFiltersReturnWithoutAll } from "@/hooks";
import { JudgeUser } from "@/types";

import { uploadAssignments } from "../_actions";
import { getJudgingAssignmentsColumns } from "../_lib/client";
import { judgingAssignmentsCsvArraySchema } from "../_schemas";
import { ROUND_1 } from "../../judging/constants";
import { JudgingAssignment, JudgingAssignmentWithProject, JudgingRound, Project } from "../../judging/types";

export type UseJudgingAssignmentsTableReturn = {
  selectedJudge: JudgeUser | null;
  setSelectedJudge: (judgeUser: JudgeUser | null) => void;
  search: UseFiltersReturnWithoutAll<JudgingRound>["search"];
  setSearch: UseFiltersReturnWithoutAll<JudgingRound>["setSearch"];
  round: UseFiltersReturnWithoutAll<JudgingRound>["category"];
  setRound: UseFiltersReturnWithoutAll<JudgingRound>["setCategory"];
  table: Table<JudgingAssignmentWithProject>;
  judgingAssignmentsColumns: ColumnDef<JudgingAssignmentWithProject>[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleUploadAssignments: (round: JudgingRound) => void;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const useJudgingAssignmentsTable = (
  judgingAssignmentsMap: Map<JudgingRound, JudgingAssignment[]>,
  projectsMap: Map<JudgingRound, Project[]>
): UseJudgingAssignmentsTableReturn => {
  const {
    category: round,
    setCategory: setRound,
    search,
    setSearch,
  } = useFilters<JudgingRound>({ includeAll: false, defaultCategory: ROUND_1 });

  const [uploadRound, setUploadRound] = useState<JudgingRound | undefined>(undefined);
  const [selectedJudge, setSelectedJudge] = useState<JudgeUser | null>(null);
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadAssignments = (round: JudgingRound) => {
    setUploadRound(round);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!uploadRound) return;

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
            const result = await uploadAssignments(parseResult.data, uploadRound);
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
    return new Map(projectsMap.get(round)?.map((project) => [project.id, project]) ?? []);
  }, [projectsMap, round]);

  const judgingAssignmentsForSelectedJudge: JudgingAssignmentWithProject[] = useMemo(() => {
    if (!selectedJudge) return [];

    let result: JudgingAssignmentWithProject[] = judgingAssignmentsMap
      .get(round)
      ?.filter((assignment) => assignment.judge_id === selectedJudge?.id)
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
  }, [selectedJudge, judgingAssignmentsMap, projectMap, search, round]);

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
