"use client";

import { MegaphoneOff } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";

import type { UseAnnouncementsReturn, UseAnnouncementsTableReturn } from "../_hooks";

type AnnouncementsTableProps = Pick<UseAnnouncementsReturn, "announcements" | "isLoading"> &
  Pick<UseAnnouncementsTableReturn, "table" | "announcementsColumns">;

const AnnouncementsTable = ({ announcements, isLoading, table, announcementsColumns }: AnnouncementsTableProps) => {
  if (isLoading) {
    return (
      <>
        <span className="sr-only">Loading announcements, please wait</span>
        <Skeleton className="h-[80px] w-full" aria-hidden="true" />
        <Skeleton className="h-[80px] w-full" aria-hidden="true" />
        <Skeleton className="h-[80px] w-full" aria-hidden="true" />
      </>
    );
  }

  if (announcements.length === 0) {
    return (
      <Empty role="status" aria-live="polite">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MegaphoneOff aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>No announcements found</EmptyTitle>
          <EmptyDescription>More announcements will be made in the future. Check back soon!</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return <DataTable columns={announcementsColumns} table={table} />;
};

export default AnnouncementsTable;
