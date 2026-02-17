"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

const renderLeaf = (item: GuideNavItem, pathname: string) => {
  if (!item.href) {
    return <span className="guide-nav-label">{item.title}</span>;
  }

  const active = isActiveHref(pathname, item.href);

  if (item.external) {
    return (
      <a
        className={`guide-nav-link${active ? " guide-nav-link-active" : ""}`}
        href={item.href}
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
    <Link className={`guide-nav-link${active ? " guide-nav-link-active" : ""}`} href={item.href} prefetch>
      {item.title}
    </Link>
  );
};

const renderNavItem = (item: GuideNavItem, pathname: string) => {
  if (item.hidden) {
    return null;
  }

  if (item.children && item.children.length > 0) {
    const childActive = item.children.some((child) => child.href && isActiveHref(pathname, child.href));

    return (
      <li key={item.title} className="guide-nav-group">
        <span className={`guide-nav-heading${childActive ? " guide-nav-heading-active" : ""}`}>{item.title}</span>
        <ul>
          {item.children.map((child) => (
            <li key={child.title}>{renderLeaf(child, pathname)}</li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li key={item.title} className="guide-nav-item">
      {renderLeaf(item, pathname)}
    </li>
  );
};

const GuideNavigation = () => {
  const pathname = usePathname() ?? "/guide";

  return (
    <nav aria-label="Guide navigation" className="guide-nav">
      <div className="guide-nav-title">
        <span>WildHacks Guide</span>
      </div>
      <ul className="guide-nav-list">{GUIDE_NAV_ITEMS.map((item) => renderNavItem(item, pathname))}</ul>
    </nav>
  );
};

export { GuideNavigation };
