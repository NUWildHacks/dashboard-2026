"use client";

import { SearchIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FOOD, SCHEDULE, SOCIAL, URGENT } from "@/constants/announcement";
import User from "@/types/user";

import { AnnouncementCategoryWithAll, useAnnouncementFilters } from "../_hooks/use-announcement-filters";
import AnnouncementDialog from "../../_components/_announcements/announcement-dialog";
import AnnouncementsList from "../../_components/_announcements/announcements-list";
import { useAnnoucementDialog } from "../../_hooks/use-announcement-dialog";
import { useAnnouncements } from "../../_hooks/use-announcements";

type AnnouncementsWithFiltersProps = {
  userRole: User["role"];
};

export default function AnnouncementsWithFilters({ userRole }: AnnouncementsWithFiltersProps) {
  const useAnnouncementFiltersReturn = useAnnouncementFilters();
  const { category, setCategory, search, setSearch } = useAnnouncementFiltersReturn; 

  const useAnnouncementsReturn = useAnnouncements(userRole, { category, search })
  const { announcements } = useAnnouncementsReturn;

  const useAnnouncementDialogReturn = useAnnoucementDialog(announcements);

  return (
    <>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Tabs value={category} onValueChange={(value) => setCategory(value as AnnouncementCategoryWithAll)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value={URGENT}>{URGENT}</TabsTrigger>
              <TabsTrigger value={SCHEDULE}>{SCHEDULE}</TabsTrigger>
              <TabsTrigger value={FOOD}>{FOOD}</TabsTrigger>
              <TabsTrigger value={SOCIAL}>{SOCIAL}</TabsTrigger>
            </TabsList>
          </Tabs>
          <InputGroup className="max-w-[350px]">
            <InputGroupInput
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="truncate"
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <AnnouncementsList {...useAnnouncementsReturn} {...useAnnouncementDialogReturn} />
      </div>
      <AnnouncementDialog {...useAnnouncementDialogReturn} />
    </>
  );
}
