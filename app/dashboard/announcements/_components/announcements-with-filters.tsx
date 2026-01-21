"use client";

import { SearchIcon } from "lucide-react";

import {
  AnnouncementDialog,
  AnnouncementsList,
  CreateAnnouncementDialog,
} from "@/app/dashboard/announcements/_components";
import { ANNOUNCEMENT_CATEGORIES } from "@/app/dashboard/announcements/_constants";
import { useAnnouncements } from "@/app/dashboard/announcements/_hooks";
import type { Announcement, AnnouncementCategory } from "@/app/dashboard/announcements/_types";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ADMIN } from "@/constants";
import { CategoryWithAll, useDialog, useFilters } from "@/hooks";
import type { User } from "@/types";

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
          <div className="w-full flex flex-col md:flex-row items-start md:items-center gap-4">
            {userRole === ADMIN && <CreateAnnouncementDialog />}
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
          </div>
          <InputGroup className="lg:max-w-[350px] min-w-[200px] w-full">
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
        <AnnouncementsList {...useAnnouncementsReturn} {...useAnnouncementDialogReturn} />
      </div>
      <AnnouncementDialog userRole={userRole} {...useAnnouncementDialogReturn} />
    </>
  );
};

export default AnnouncementsWithFilters;
