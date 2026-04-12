"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { GuideSearchEntry } from "../_data/guide-search-data";

/** Shown on every guide page: last updated, prev/next nav, copyright. */
const GUIDE_LAST_UPDATED = "April 12, 2026";

type GuideContentFooterProps = {
  entries: GuideSearchEntry[];
};

const GuideContentFooter = ({ entries }: GuideContentFooterProps) => {
  const pathname = usePathname() ?? "/guide";
  const normalizedPath = pathname === "/guide" || pathname === "/guide/" ? "/guide" : pathname.replace(/\/$/, "");

  const index = entries.findIndex(
    (e) =>
      e.href === normalizedPath ||
      e.href === pathname ||
      (e.href === "/guide" && (pathname === "/guide" || pathname === "/guide/"))
  );
  const prev = index > 0 ? entries[index - 1] : null;
  const next = index >= 0 && index < entries.length - 1 ? entries[index + 1] : null;

  return (
    <footer className="guide-content-footer" role="contentinfo">
      <nav className="guide-content-footer-nav" aria-label="Guide page navigation">
        <div className="guide-content-footer-nav-inner">
          {prev ? (
            <Link href={prev.href} className="guide-content-footer-link guide-content-footer-prev">
              <ArrowLeft className="guide-content-footer-arrow" aria-hidden />
              <span>{prev.title}</span>
            </Link>
          ) : (
            <span aria-hidden className="guide-content-footer-spacer" />
          )}
          {next ? (
            <Link href={next.href} className="guide-content-footer-link guide-content-footer-next">
              <span>{next.title}</span>
              <ArrowRight className="guide-content-footer-arrow" aria-hidden />
            </Link>
          ) : (
            <span aria-hidden className="guide-content-footer-spacer" />
          )}
        </div>
      </nav>
      <div className="guide-content-footer-copyright">
        <p className="guide-content-footer-updated">Last updated on {GUIDE_LAST_UPDATED}</p>
        <p>Copyright © 2026 WildHacks.</p>
      </div>
    </footer>
  );
};

export { GuideContentFooter, GUIDE_LAST_UPDATED };
