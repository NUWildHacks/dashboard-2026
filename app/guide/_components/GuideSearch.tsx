"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { GuideSearchEntry, GuideSearchRecord } from "../_data/guide-search-data";

type GuideSearchProps = {
  entries: GuideSearchEntry[];
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeDisplayLabel = (value: string): string => {
  const normalizedSpacing = value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/\s+/g, " ");
  // .trim();

  return normalizedSpacing.replace(/(\b(?:Page|Route)\b\s*)+$/i, "").trim();
};

const scoreResult = (record: GuideSearchRecord, normalizedQuery: string): number => {
  let score = 0;
  const nText = normalize(record.text);
  const nPageTitle = normalize(record.pageTitle);
  const nSectionTitle = normalize(record.sectionTitle ?? "");
  const nSearchText = normalize(record.searchText);

  if (nText.includes(normalizedQuery)) score += 40;
  if (nPageTitle.includes(normalizedQuery)) score += 28;
  if (nSectionTitle.includes(normalizedQuery)) score += 20;
  if (nSearchText.includes(normalizedQuery)) score += 12;

  if (record.kind === "heading") score += 12;
  if (record.kind === "page") score += 8;

  return score;
};

const highlightMatch = (text: string, query: string) => {
  if (!query.trim() || !text) {
    return text;
  }

  const pattern = new RegExp(`(${escapeRegExp(query.trim())})`, "ig");
  const parts = text.split(pattern);
  const normalizedQuery = query.trim().toLowerCase();

  if (parts.length === 1) {
    return text;
  }

  return parts.map((part, index) =>
    part.toLowerCase() === normalizedQuery ? (
      <mark key={`${part}-${index}`} className="guide-search-highlight">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
};

const getResultTitle = (result: GuideSearchRecord) => {
  if (result.kind === "page") {
    return normalizeDisplayLabel(result.pageTitle);
  }

  if (result.kind === "heading") {
    return normalizeDisplayLabel(result.text);
  }

  return result.snippet ?? result.text;
};

const getResultMeta = (result: GuideSearchRecord) => {
  if (result.kind === "page") {
    return "";
  }

  if (result.kind === "heading") {
    return `Heading in ${normalizeDisplayLabel(result.pageTitle)}`;
  }

  const section =
    result.sectionTitle && result.sectionTitle !== result.pageTitle
      ? `Under ${normalizeDisplayLabel(result.sectionTitle)}`
      : null;
  const pageLabel = normalizeDisplayLabel(result.pageTitle);
  return section ? `${pageLabel} • ${section}` : `${pageLabel}`;
};

const GuideSearch = ({ entries }: GuideSearchProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const allRecords = useMemo(() => entries.flatMap((entry) => entry.records), [entries]);

  const filtered = useMemo(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return allRecords.filter((record) => record.kind === "page").slice(0, 14);
    }

    const normalizedQuery = normalize(trimmedQuery);
    return allRecords
      .filter((record) => normalize(record.searchText).includes(normalizedQuery))
      .map((record) => ({ ...record, score: scoreResult(record, normalizedQuery) }))
      .sort((a, b) => b.score - a.score || a.pageTitle.localeCompare(b.pageTitle))
      .slice(0, 45);
  }, [allRecords, query]);

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
              {filtered.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.text} ${result.pageTitle} ${result.sectionTitle ?? ""}`}
                  onSelect={() => handleSelect(result.href)}
                  className="guide-search-item"
                >
                  <Link
                    href={result.href}
                    className="guide-search-link"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelect(result.href);
                    }}
                  >
                    <span className="guide-search-result-title">{highlightMatch(getResultTitle(result), query)}</span>
                    <span className="guide-search-result-meta">{highlightMatch(getResultMeta(result), query)}</span>
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
