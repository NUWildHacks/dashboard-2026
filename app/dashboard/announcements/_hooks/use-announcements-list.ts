"use client";

import { useMemo, useState } from "react";

import { Announcement, Category } from "@/types/announcement";
import { announcements } from "@/constants/announcement";

export type UseAnnouncementFiltersReturn = {
  category: Category | "all";
  setCategory: (category: Category | "all") => void;
  search: string;
  setSearch: (search: string) => void;
  filteredAnnouncements: Announcement[];
};

export const useAnnouncementFilters = (): UseAnnouncementFiltersReturn => {
  const [category, setCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState<string>("");

  const filteredAnnouncements = useMemo(() => {
    let tempAnnouncements = [...announcements]

    if (category !== "all") {
      tempAnnouncements = tempAnnouncements.filter((announcement) => announcement.category === category);
    }

    if (search !== "") {
      tempAnnouncements = tempAnnouncements.filter((announcement) => 
        Object.values(announcement).some(
          (value) => typeof value === "string" && value.toLowerCase().includes(search.toLowerCase())
        )
      )
    }

    return tempAnnouncements
  }, [category, search, announcements])

  return { category, setCategory, search, setSearch, filteredAnnouncements };
};
