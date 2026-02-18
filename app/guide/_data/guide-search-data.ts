import type { GuideNavItem } from "../_components/navigation-data";
import { GUIDE_NAV_ITEMS } from "../_components/navigation-data";

export type GuideSearchEntry = {
  readonly title: string;
  readonly href: string;
};

function flattenNavItems(items: GuideNavItem[], basePath = ""): GuideSearchEntry[] {
  const entries: GuideSearchEntry[] = [];

  for (const item of items) {
    if (item.children?.length) {
      entries.push(...flattenNavItems(item.children, item.title));
      continue;
    }
    if (item.href && !item.external && item.href.startsWith("/guide")) {
      entries.push({ title: item.title, href: item.href });
    }
  }

  return entries;
}

/** Flat list of all guide MDX pages for search (title + href). */
export const GUIDE_SEARCH_ENTRIES: GuideSearchEntry[] = flattenNavItems(GUIDE_NAV_ITEMS);
