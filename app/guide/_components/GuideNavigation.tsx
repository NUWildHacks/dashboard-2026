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

const renderLeaf = (item: GuideNavItem, pathname: string, onNavigate?: () => void) => {
  if (!item.href) {
    return <span className="guide-nav-label">{item.title}</span>;
  }

  const active = isActiveHref(pathname, item.href);

  if (item.external) {
    return (
      <a
        className={`guide-nav-link${active ? " guide-nav-link-active" : ""}`}
        href={item.href}
        onClick={onNavigate}
        rel="noreferrer"
        target="_blank"
      >
        {item.title}
        <span aria-hidden className="guide-nav-external">
          ↗
        </span>
      </a>
    );
  }

  return (
    <Link
      className={`guide-nav-link${active ? " guide-nav-link-active" : ""}`}
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
  openSections: Set<string>;
  onToggleSection: (title: string) => void;
  onNavigate?: () => void;
};

const NavItem = ({ item, pathname, openSections, onToggleSection, onNavigate }: NavItemProps) => {
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
          className={`guide-nav-heading guide-nav-heading-button${childActive ? " guide-nav-heading-active" : ""}`}
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
            <li key={child.title}>{renderLeaf(child, pathname, onNavigate)}</li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li key={item.title} className="guide-nav-item">
      {renderLeaf(item, pathname, onNavigate)}
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
