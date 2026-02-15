"use client";

import { List, Table2, SearchIcon } from "lucide-react";

import {
  AnnouncementDialog,
  AnnouncementsList,
  AnnouncementFormDialog,
} from "@/app/dashboard/announcements/_components";
import {
  useAnnouncementFormDialog,
  useAnnouncements,
  useAnnouncementsDisplay,
  useAnnouncementsTable,
} from "@/app/dashboard/announcements/_hooks";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADMIN } from "@/constants";
import { CategoryWithAll, useItemDialog, useFilters } from "@/hooks";
import type { User } from "@/types";

import { ANNOUNCEMENT_CATEGORIES } from "../constants";
import { AnnouncementCategory, Announcement } from "../types";

type AnnouncementsDisplayProps = {
  userRole: User["role"];
};

const AnnouncementsDisplay = ({ userRole }: AnnouncementsDisplayProps) => {
  const { display, setDisplay } = useAnnouncementsDisplay();

  const { category, setCategory, search, setSearch } = useFilters<AnnouncementCategory>();

  const useAnnouncementsReturn = useAnnouncements({ category, search });
  const { announcements, handleDeleteAnnouncements } = useAnnouncementsReturn;

  const useAnnouncementDialogReturn = useItemDialog<Announcement>(announcements);
  const { handleSelectItem } = useAnnouncementDialogReturn;

  const useAnnouncementFormDialogReturn = useAnnouncementFormDialog();
  const { handleOpenAnnouncementFormDialog } = useAnnouncementFormDialogReturn;

  const useAnnouncementsTableReturn = useAnnouncementsTable(
    announcements,
    handleSelectItem,
    handleOpenAnnouncementFormDialog,
    handleDeleteAnnouncements
  );
  const { selectedAnnouncementIds, announcementsColumns, table } = useAnnouncementsTableReturn;

  return (
    <>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="w-full flex flex-col lg:flex-row gap-4">
            {userRole === ADMIN && (
              <Button className="w-full md:w-auto" onClick={() => handleOpenAnnouncementFormDialog()}>
                Create announcement
              </Button>
            )}
            {selectedAnnouncementIds.length > 0 && display === "table" && userRole === ADMIN && (
              <Button
                variant="destructive"
                onClick={() => handleDeleteAnnouncements(selectedAnnouncementIds)}
                className="w-full md:w-auto"
              >
                Delete announcement(s)
              </Button>
            )}
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as CategoryWithAll<AnnouncementCategory>)}
            >
              <SelectTrigger
                id="category-filter"
                className="min-w-[115px] lg:w-[115px] w-full"
                aria-label="Filter announcements by category"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {ANNOUNCEMENT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {userRole === ADMIN && (
              <Tabs value={display} onValueChange={(value) => setDisplay(value as "list" | "table")}>
                <TabsList className="w-full lg:w-fit">
                  <TabsTrigger value="list">
                    <List />
                    List
                  </TabsTrigger>
                  <TabsTrigger value="table">
                    <Table2 />
                    Table
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
          <InputGroup className="lg:max-w-[350px] w-full">
            <InputGroupInput
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="truncate"
              aria-label="Search announcements"
            />
            <InputGroupAddon>
              <SearchIcon aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>
        </div>
        {display === "list" && <AnnouncementsList {...useAnnouncementsReturn} {...useAnnouncementDialogReturn} />}
        {display === "table" && userRole === ADMIN && <DataTable columns={announcementsColumns} table={table} />}
      </div>
      <AnnouncementDialog userRole={userRole} {...useAnnouncementDialogReturn} />
      {userRole === ADMIN && <AnnouncementFormDialog {...useAnnouncementFormDialogReturn} />}
    </>
  );
};

export default AnnouncementsDisplay;
