"use client";

import { ChangeEvent, useState } from "react";

import { Announcement, Category } from "@/types/announcement";

export type UseAnnouncementsListReturn = {
  category: Category | "all";
  search: string;
  filteredAnnouncements: Announcement[];
  handleCategoryChange: (value: string) => void;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const useAnnouncementsList = (announcements: Announcement[]): UseAnnouncementsListReturn => {
  const [category, setCategory] = useState<Category | "all">("all");
  const [search, setSearch] = useState<string>("");

  const filteredAnnouncements = announcements
    .filter((announcement) => announcement.category === category)
    .filter((announcement) =>
      Object.values(announcement).some(
        (value) => typeof value === "string" && value.toLowerCase().includes(search.toLowerCase())
      )
    );

  const handleCategoryChange = (value: string) => {
    setCategory((value as Category) || "all");
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return { category, search, filteredAnnouncements, handleSearchChange, handleCategoryChange };
};
