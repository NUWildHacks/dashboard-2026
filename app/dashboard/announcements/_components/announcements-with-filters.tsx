"use client";

import { SearchIcon } from "lucide-react";

import { ANNOUNCEMENT_CATEGORIES } from "@/app/dashboard/announcements/_constants/announcement.constant";
import { useAnnouncements } from "@/app/dashboard/announcements/_hooks";
import type { Announcement, AnnouncementCategory } from "@/app/dashboard/announcements/_types";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDialog } from "@/hooks/use-dialog";
import { CategoryWithAll, useFilters } from "@/hooks/use-filters";
import User from "@/types/user";

import { AnnouncementDialog, AnnouncementsList } from "./";

type AnnouncementsWithFiltersProps = {
  userRole: User["role"];
};

const AnnouncementsWithFilters = ({ userRole }: AnnouncementsWithFiltersProps) => {
  const { category, setCategory, search, setSearch } = useFilters<AnnouncementCategory>();

  const useAnnouncementsReturn = useAnnouncements(userRole, { category, search });
  const { announcements } = useAnnouncementsReturn;

  const useAnnouncementDialogReturn = useDialog<Announcement>(announcements);

  return (
    <>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Tabs value={category} onValueChange={(value) => setCategory(value as CategoryWithAll<AnnouncementCategory>)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {ANNOUNCEMENT_CATEGORIES.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
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
};

export default AnnouncementsWithFilters;
