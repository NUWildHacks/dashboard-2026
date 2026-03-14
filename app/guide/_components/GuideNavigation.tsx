"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import type { GuideNavItem } from "./navigation-data";
import { GUIDE_NAV_ITEMS } from "./navigation-data";

const isActiveHref = (pathname: string, href: string) => {
  if (pathname === href) {
    return true;
  }

  if (href === "/guide") {
    return pathname === "/guide" || pathname === "/guide/";
  }

  return pathname.startsWith(`${href}/`);
};

const getSectionContainingPath = (pathname: string): string | null => {
  const item = GUIDE_NAV_ITEMS.find(
    (i) => i.children?.length && i.children.some((c) => c.href && isActiveHref(pathname, c.href))
  );
  return item?.title ?? null;
};

const getLevel = (depth: number) => Math.min(Math.max(depth, 1), 3);

const renderLeaf = (item: GuideNavItem, pathname: string, depth: number, onNavigate?: () => void) => {
  if (!item.href) {
    return <span className={`guide-nav-label guide-nav-label-level-${getLevel(depth)}`}>{item.title}</span>;
  }

  const active = isActiveHref(pathname, item.href);
  const levelClass = `guide-nav-link-level-${getLevel(depth)}`;

  if (item.external) {
    return (
      <a
        className={`guide-nav-link ${levelClass}${active ? " guide-nav-link-active" : ""}`}
        href={item.href}
        onClick={onNavigate}
        rel="noreferrer"
        target="_blank"
      >
        {item.title}
      </a>
    );
  }

  return (
    <Link
      className={`guide-nav-link ${levelClass}${active ? " guide-nav-link-active" : ""}`}
      href={item.href}
      onClick={onNavigate}
      prefetch
    >
      {item.title}
    </Link>
  );
};

type NavItemProps = {
  item: GuideNavItem;
  pathname: string;
  depth: number;
  openSections: Set<string>;
  onToggleSection: (title: string) => void;
  onNavigate?: () => void;
};

const NavItem = ({ item, pathname, depth, openSections, onToggleSection, onNavigate }: NavItemProps) => {
  if (item.hidden) {
    return null;
  }

  if (item.children && item.children.length > 0) {
    const childActive = item.children.some((child) => child.href && isActiveHref(pathname, child.href));
    const isOpen = openSections.has(item.title);

    return (
      <li key={item.title} className="guide-nav-group">
        <button
          type="button"
          className={`guide-nav-heading guide-nav-heading-button guide-nav-heading-level-${getLevel(depth)}${childActive ? " guide-nav-heading-active" : ""}`}
          onClick={() => onToggleSection(item.title)}
          aria-expanded={isOpen}
          aria-controls={`guide-nav-section-${item.title.replace(/\s+/g, "-").toLowerCase()}`}
          id={`guide-nav-heading-${item.title.replace(/\s+/g, "-").toLowerCase()}`}
        >
          <span className="guide-nav-heading-text">{item.title}</span>
          <ChevronDown className={`guide-nav-chevron${isOpen ? " guide-nav-chevron-open" : ""}`} aria-hidden />
        </button>
        <ul
          id={`guide-nav-section-${item.title.replace(/\s+/g, "-").toLowerCase()}`}
          className={`guide-nav-sublist${isOpen ? "" : " guide-nav-sublist-collapsed"}`}
          role="group"
          aria-labelledby={`guide-nav-heading-${item.title.replace(/\s+/g, "-").toLowerCase()}`}
        >
          {item.children.map((child) => (
            <li key={child.title}>{renderLeaf(child, pathname, depth + 1, onNavigate)}</li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li key={item.title} className="guide-nav-item">
      {renderLeaf(item, pathname, depth, onNavigate)}
    </li>
  );
};

type GuideNavigationProps = {
  onNavigate?: () => void;
};

const GuideNavigation = ({ onNavigate }: GuideNavigationProps) => {
  const pathname = usePathname() ?? "/guide";
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set());

  const openSectionForPath = useCallback(() => {
    const section = getSectionContainingPath(pathname);
    if (section) {
      setOpenSections((prev) => new Set(prev).add(section));
    }
  }, [pathname]);

  useEffect(() => {
    const t = setTimeout(openSectionForPath, 0);
    return () => clearTimeout(t);
  }, [openSectionForPath]);

  const onToggleSection = useCallback((title: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  }, []);

  return (
    <nav className="guide-nav">
      <ul className="guide-nav-list">
        {GUIDE_NAV_ITEMS.map((item) => (
          <NavItem
            key={item.title}
            item={item}
            pathname={pathname}
            depth={1}
            openSections={openSections}
            onToggleSection={onToggleSection}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    </nav>
  );
};

export { GuideNavigation };
