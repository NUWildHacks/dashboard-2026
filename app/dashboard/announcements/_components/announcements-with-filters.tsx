"use client";

import { SearchIcon } from "lucide-react";

import { AnnouncementDialog, AnnouncementsList } from "@/app/dashboard/announcements/_components";
import { ANNOUNCEMENT_CATEGORIES } from "@/app/dashboard/announcements/_constants";
import { useAnnouncements } from "@/app/dashboard/announcements/_hooks";
import type { Announcement, AnnouncementCategory } from "@/app/dashboard/announcements/_types";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="category-filter" className="sr-only">
              Filter by category
            </Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as CategoryWithAll<AnnouncementCategory>)}
            >
              <SelectTrigger id="category-filter" className="w-[200px]" aria-label="Filter announcements by category">
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="search" className="sr-only">
              Search announcements
            </Label>
            <InputGroup className="max-w-[350px]">
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
        </div>
        <AnnouncementsList {...useAnnouncementsReturn} {...useAnnouncementDialogReturn} />
      </div>
      <AnnouncementDialog {...useAnnouncementDialogReturn} />
    </>
  );
};

export default AnnouncementsWithFilters;
