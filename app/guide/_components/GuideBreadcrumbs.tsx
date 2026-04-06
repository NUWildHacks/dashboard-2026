"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import type { GuideSearchEntry } from "../_data/guide-search-data";

type GuideBreadcrumbsProps = {
  entries: GuideSearchEntry[];
};

type Breadcrumb = {
  href: string;
  label: string;
  current: boolean;
};

const normalizePath = (pathname: string) => {
  if (pathname === "/guide/") {
    return "/guide";
  }

  return pathname.replace(/\/$/, "");
};

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const formatSegmentLabel = (segment: string) =>
  safeDecode(segment)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const GuideBreadcrumbs = ({ entries }: GuideBreadcrumbsProps) => {
  const pathname = usePathname() ?? "/guide";
  const normalizedPath = normalizePath(pathname);

  const entryMap = useMemo(() => new Map(entries.map((entry) => [entry.href, entry.title])), [entries]);

  const breadcrumbs = useMemo<Breadcrumb[]>(() => {
    if (!normalizedPath.startsWith("/guide")) {
      return [];
    }

    const segments = normalizedPath.split("/").filter(Boolean);
    const crumbList: Omit<Breadcrumb, "current">[] = [{ href: "/guide", label: "Guide" }];

    for (let index = 1; index < segments.length; index += 1) {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const label = entryMap.get(href) ?? formatSegmentLabel(segments[index]);
      crumbList.push({ href, label });
    }

    return crumbList.map((crumb, index) => ({
      ...crumb,
      current: index === crumbList.length - 1,
    }));
  }, [entryMap, normalizedPath]);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="guide-breadcrumbs" aria-label="Breadcrumb">
      <ol className="guide-breadcrumbs-list">
        {breadcrumbs.map((crumb) => (
          <li key={crumb.href} className="guide-breadcrumbs-item">
            {crumb.current ? (
              <span className="guide-breadcrumbs-current" aria-current="page">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="guide-breadcrumbs-link">
                {crumb.label}
              </Link>
            )}
            {!crumb.current ? (
              <span className="guide-breadcrumbs-separator" aria-hidden>
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export { GuideBreadcrumbs };
