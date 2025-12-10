"use client";

import { SearchIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ANNOUNCEMENT_CATEGORIES } from "@/constants/announcement";
import Announcement, { AnnouncementCategory } from "@/types/announcement";
import User from "@/types/user";

import AnnouncementDialog from "../../_components/_announcements/announcement-dialog";
import AnnouncementsList from "../../_components/_announcements/announcements-list";
import { useAnnouncements } from "../../_hooks/use-announcements";
import { useDialog } from "../../_hooks/use-dialog";
import { CategoryWithAll, useFilters } from "../../_hooks/use-filters";

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
