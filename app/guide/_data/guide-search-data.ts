import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { GuideNavItem } from "../_components/navigation-data";
import { GUIDE_NAV_ITEMS } from "../_components/navigation-data";

export type GuideSearchEntry = {
  readonly title: string;
  readonly href: string;
  readonly searchText: string;
};

const GUIDE_DIRECTORY = path.join(process.cwd(), "app", "guide");
const MAX_SEARCH_TEXT_LENGTH = 5000;

const stripMdxToText = (source: string): string =>
  source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, " $1 ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/[*_~>#|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getGuidePageContent = (href: string): string => {
  if (!href.startsWith("/guide")) {
    return "";
  }

  const relativePath = href.replace(/^\/guide\/?/, "");
  const segments = relativePath ? relativePath.split("/") : [];
  const pagePath = path.join(GUIDE_DIRECTORY, ...segments, "page.mdx");

  if (!existsSync(pagePath)) {
    return "";
  }

  const raw = readFileSync(pagePath, "utf8");
  return stripMdxToText(raw).slice(0, MAX_SEARCH_TEXT_LENGTH);
};

function flattenNavItems(items: GuideNavItem[]): GuideSearchEntry[] {
  const entries: GuideSearchEntry[] = [];

  for (const item of items) {
    if (item.children?.length) {
      entries.push(...flattenNavItems(item.children));
      continue;
    }
    if (item.href && !item.external && item.href.startsWith("/guide")) {
      entries.push({
        title: item.title,
        href: item.href,
        searchText: getGuidePageContent(item.href),
      });
    }
  }

  return entries;
}

/** Flat list of all guide MDX pages for search (title + href). */
export const GUIDE_SEARCH_ENTRIES: GuideSearchEntry[] = flattenNavItems(GUIDE_NAV_ITEMS);
