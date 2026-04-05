"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { GuideSearchEntry } from "../_data/guide-search-data";

type GuideSearchProps = {
  entries: GuideSearchEntry[];
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const matchQuery = (entry: GuideSearchEntry, q: string): boolean => {
  if (!q.trim()) return true;
  const nq = normalize(q);
  const nTitle = normalize(entry.title);
  const nHref = normalize(entry.href);
  return nTitle.includes(nq) || nHref.includes(nq);
};

const GuideSearch = ({ entries }: GuideSearchProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filtered = query.trim() ? entries.filter((e) => matchQuery(e, query)) : entries;

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="guide-search-trigger" aria-label="Search guide pages (⌘K)">
          <SearchIcon className="guide-search-icon" aria-hidden />
          <span className="guide-search-trigger-text">Search guide...</span>
          <kbd className="guide-search-kbd">⌘K</kbd>
        </button>
      </PopoverTrigger>
      <PopoverContent className="guide-search-popover" align="end" sideOffset={8}>
        <Command className="guide-search-command" shouldFilter={false}>
          <CommandInput
            placeholder="Search pages..."
            value={query}
            onValueChange={setQuery}
            className="guide-search-input"
          />
          <CommandList className="guide-search-list">
            <CommandEmpty className="guide-search-empty">No pages found.</CommandEmpty>
            <CommandGroup className="guide-search-group">
              {filtered.map((entry) => (
                <CommandItem
                  key={entry.href}
                  value={`${entry.title} ${entry.href}`}
                  onSelect={() => handleSelect(entry.href)}
                  className="guide-search-item"
                >
                  <Link
                    href={entry.href}
                    className="guide-search-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelect(entry.href);
                    }}
                  >
                    {entry.title}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { GuideSearch };
