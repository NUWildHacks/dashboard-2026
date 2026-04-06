import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { GuideNavItem } from "../_components/navigation-data";
import { GUIDE_NAV_ITEMS } from "../_components/navigation-data";

type GuideSearchRecordKind = "page" | "heading" | "content";

export type GuideSearchRecord = {
  readonly id: string;
  readonly kind: GuideSearchRecordKind;
  readonly href: string;
  readonly pageTitle: string;
  readonly sectionTitle?: string;
  readonly text: string;
  readonly snippet?: string;
  readonly searchText: string;
};

export type GuideSearchEntry = {
  readonly title: string;
  readonly href: string;
  readonly searchText: string;
  readonly records: GuideSearchRecord[];
};

const GUIDE_DIRECTORY = path.join(process.cwd(), "app", "guide");
const MAX_SEARCH_TEXT_LENGTH = 5000;
const MAX_CONTENT_RECORDS_PER_PAGE = 40;
const MIN_CONTENT_LENGTH = 28;
const MAX_SNIPPET_LENGTH = 180;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const clipText = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
};

const stripInlineFormatting = (source: string): string =>
  source
    .replace(/\[([^\]]+)\]\([^)]*\)/g, " $1 ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, " $1 ")
    .replace(/`([^`]*)`/g, " $1 ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/\*\*([^*]+)\*\*/g, " $1 ")
    .replace(/\*([^*]+)\*/g, " $1 ")
    .replace(/_([^_]+)_/g, " $1 ")
    .replace(/~~([^~]+)~~/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();

const parseMdxRecords = (raw: string, href: string, title: string): GuideSearchRecord[] => {
  const lines = raw.split(/\r?\n/);
  const records: GuideSearchRecord[] = [];
  const fullTextParts: string[] = [];
  const headingIds = new Map<string, number>();
  const blockLines: string[] = [];

  let sectionTitle = title;
  let sectionId: string | undefined;
  let contentCounter = 0;

  const flushContentBlock = () => {
    if (contentCounter >= MAX_CONTENT_RECORDS_PER_PAGE || blockLines.length === 0) {
      blockLines.length = 0;
      return;
    }

    const rawBlock = blockLines.join(" ");
    blockLines.length = 0;

    const cleaned = stripInlineFormatting(rawBlock);
    if (cleaned.length < MIN_CONTENT_LENGTH) {
      return;
    }

    contentCounter += 1;
    fullTextParts.push(cleaned);
    const targetHref = sectionId ? `${href}#${sectionId}` : href;
    const snippet = clipText(cleaned, MAX_SNIPPET_LENGTH);

    records.push({
      id: `${href}::content-${contentCounter}`,
      kind: "content",
      href: targetHref,
      pageTitle: title,
      sectionTitle,
      text: cleaned,
      snippet,
      searchText: `${title} ${sectionTitle} ${cleaned}`,
    });
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushContentBlock();
      continue;
    }

    if (/^---$/.test(trimmed)) {
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushContentBlock();

      const headingText = stripInlineFormatting(headingMatch[2].replace(/#+\s*$/, "")).trim();
      if (!headingText) {
        continue;
      }

      const headingBaseId = slugify(headingText);
      if (!headingBaseId) {
        continue;
      }

      const seen = (headingIds.get(headingBaseId) ?? 0) + 1;
      headingIds.set(headingBaseId, seen);
      const headingId = seen > 1 ? `${headingBaseId}-${seen}` : headingBaseId;

      sectionTitle = headingText;
      sectionId = headingId;
      fullTextParts.push(headingText);

      records.push({
        id: `${href}::heading-${headingId}`,
        kind: "heading",
        href: `${href}#${headingId}`,
        pageTitle: title,
        sectionTitle: headingText,
        text: headingText,
        searchText: `${title} ${headingText}`,
      });
      continue;
    }

    const normalizedLine = trimmed
      .replace(/^>\s?/, "")
      .replace(/^[-*+]\s+/, "")
      .replace(/^\d+\.\s+/, "")
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .replace(/\|/g, " ");

    if (normalizedLine) {
      blockLines.push(normalizedLine);
    }
  }

  flushContentBlock();

  const fullText = clipText(`${title} ${fullTextParts.join(" ")}`.trim(), MAX_SEARCH_TEXT_LENGTH);

  return [
    {
      id: `${href}::page`,
      kind: "page",
      href,
      pageTitle: title,
      text: title,
      snippet: clipText(fullText, MAX_SNIPPET_LENGTH),
      searchText: fullText,
    },
    ...records,
  ];
};

const getGuideSearchRecords = (href: string, title: string): GuideSearchRecord[] => {
  if (!href.startsWith("/guide")) {
    return [];
  }

  const relativePath = href.replace(/^\/guide\/?/, "");
  const segments = relativePath ? relativePath.split("/") : [];
  const pagePath = path.join(GUIDE_DIRECTORY, ...segments, "page.mdx");

  if (!existsSync(pagePath)) {
    return [
      {
        id: `${href}::page`,
        kind: "page",
        href,
        pageTitle: title,
        text: title,
        searchText: `${title} ${href}`,
      },
    ];
  }

  const raw = readFileSync(pagePath, "utf8");
  return parseMdxRecords(raw, href, title);
};

function flattenNavItems(items: GuideNavItem[]): GuideSearchEntry[] {
  const entries: GuideSearchEntry[] = [];

  for (const item of items) {
    if (item.children?.length) {
      entries.push(...flattenNavItems(item.children));
      continue;
    }
    if (item.href && !item.external && item.href.startsWith("/guide")) {
      const records = getGuideSearchRecords(item.href, item.title);
      entries.push({
        title: item.title,
        href: item.href,
        searchText: records
          .map((record) => record.searchText)
          .join(" ")
          .slice(0, MAX_SEARCH_TEXT_LENGTH),
        records,
      });
    }
  }

  return entries;
}

/** Flat list of all guide MDX pages for search (title + href). */
export const GUIDE_SEARCH_ENTRIES: GuideSearchEntry[] = flattenNavItems(GUIDE_NAV_ITEMS);
