"use client";

import { MegaphoneOff, SearchIcon } from "lucide-react";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FOOD, SCHEDULE, SOCIAL, URGENT } from "@/constants/announcement";
import { Announcement } from "@/types/announcement";

import { useAnnouncementsList } from "../_hooks/use-announcements-list";

type AnnouncementsListProps = {
  announcements: Announcement[];
};

export default function AnnouncementList({ announcements }: AnnouncementsListProps) {
  const { category, search, handleSearchChange, handleCategoryChange, filteredAnnouncements } =
    useAnnouncementsList(announcements);

  return (
    <div className="flex-1 flex flex-col gap-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-x-4 gap-y-2">
        <Tabs value={category} onValueChange={handleCategoryChange}>
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
            value={search}
            onChange={handleSearchChange}
            placeholder="Search announcements..."
            className="truncate"
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>
      {filteredAnnouncements.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MegaphoneOff />
            </EmptyMedia>
            <EmptyTitle>No announcements</EmptyTitle>
            <EmptyDescription>Check back in closer to the event start date.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col justify-start items-center gap-2">
          {announcements.map((announcement) => (
            <div key={announcement.id}>{announcement.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
