"use client";

import { useState } from "react";

import { AnnouncementCategory } from "@/types/announcement";

export type AnnouncementCategoryWithAll = AnnouncementCategory | "all"

export type UseAnnouncementFiltersReturn = {
  category: AnnouncementCategoryWithAll;
  setCategory: (category: AnnouncementCategory | "all") => void;
  search: string;
  setSearch: (search: string) => void;
};

export const useAnnouncementFilters = (): UseAnnouncementFiltersReturn => {
  const [category, setCategory] = useState<AnnouncementCategoryWithAll>("all");
  const [search, setSearch] = useState<string>("");

  return {
    category,
    setCategory,
    search,
    setSearch,
  };
};
