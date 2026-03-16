"use client";

import { SearchIcon } from "lucide-react";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryWithAll, useFilters } from "@/hooks";

import { TRACKS } from "../constants";
import type { ProjectWithMetadata, Track } from "../types";

import { AssignedProjectGrid } from ".";

type JudgingDisplayProps = {
  projectsWithMetadata: ProjectWithMetadata[];
};

const JudgingDisplay = ({ projectsWithMetadata }: JudgingDisplayProps) => {
  const { category, setCategory, search, setSearch } = useFilters<Track>();

  return (
    <>
      <div className="h-full flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <Select value={category} onValueChange={(value) => setCategory(value as CategoryWithAll<Track>)}>
            <SelectTrigger className="min-w-[190px] lg:w-[190px] w-full">
              <SelectValue placeholder="Select track" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                {TRACKS.map((track) => (
                  <SelectItem key={track} value={track}>
                    {track}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <InputGroup className="lg:max-w-[350px] w-full">
            <InputGroupInput
              id="search-projects"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="truncate"
              aria-label="Search projects"
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <Alert className="rounded-md border-yellow-600 bg-yellow-600/10 text-yellow-600 dark:border-yellow-400 dark:bg-yellow-400/10 dark:text-yellow-400">
          <AlertTitle>Judging guide coming soon...</AlertTitle>
        </Alert>
        <AssignedProjectGrid projectsWithMetadata={projectsWithMetadata} />
      </div>
    </>
  );
};

export default JudgingDisplay;
