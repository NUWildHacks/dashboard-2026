"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import type { GuideSearchEntry } from "../_data/guide-search-data";

import { GuideBreadcrumbs } from "./GuideBreadcrumbs";
import { GuideContentFooter } from "./GuideContentFooter";
import { GuideNavigation } from "./GuideNavigation";
import { GuideOnThisPage } from "./GuideOnThisPage";
import { GuideTopbar } from "./GuideTopbar";

type GuideShellProps = {
  readonly children: ReactNode;
  readonly entries: GuideSearchEntry[];
};

const GuideShell = ({ children, entries }: GuideShellProps) => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  useEffect(() => {
    if (!isNavigationOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNavigationOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isNavigationOpen]);

  return (
    <div className={`guide-shell${isNavigationOpen ? " guide-shell-nav-open" : ""}`}>
      <GuideTopbar
        entries={entries}
        isNavigationOpen={isNavigationOpen}
        onToggleNavigation={() => setIsNavigationOpen((open) => !open)}
      />
      <div className="guide-body">
        <aside id="guide-navigation-panel" className="guide-sidebar" aria-label="Guide navigation">
          <GuideNavigation onNavigate={() => setIsNavigationOpen(false)} />
        </aside>
        <main className="guide-main" role="main">
          <div className="guide-content">
            <div className="guide-content-body">
              <GuideBreadcrumbs entries={entries} />
              <GuideOnThisPage />
              <div id="guide-content-article" className="guide-content-article">
                {children}
              </div>
            </div>
            <GuideContentFooter entries={entries} />
          </div>
        </main>
      </div>
    </div>
  );
};

export { GuideShell };
