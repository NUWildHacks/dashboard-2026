"use client";

import { SearchIcon } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FOOD, SCHEDULE, SOCIAL, URGENT } from "@/constants/announcement";

import AnnouncementsList from "../../_components/announcements/announcements-list";
import { useAnnouncementFilters } from "../_hooks/use-announcements-list";
import { Category } from "@/types/announcement";

export default function Announcements() {
  const { category, setCategory, search, setSearch, filteredAnnouncements } = useAnnouncementFilters();

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Tabs value={category} onValueChange={(value) => setCategory(value as Category | "all")}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value={URGENT}>Urgent</TabsTrigger>
            <TabsTrigger value={SCHEDULE}>Schedule</TabsTrigger>
            <TabsTrigger value={FOOD}>Food</TabsTrigger>
            <TabsTrigger value={SOCIAL}>Social</TabsTrigger>
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
      <AnnouncementsList announcements={filteredAnnouncements}/>
    </div>
  );
}
