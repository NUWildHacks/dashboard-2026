import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Figtree } from "next/font/google";
import { GuideNavigation } from "./_components/GuideNavigation";
import { GuideSearch } from "./_components/GuideSearch";
import { GUIDE_SEARCH_ENTRIES } from "./_data/guide-search-data";
import "./guide.css";

type GuideLayoutProps = {
  readonly children: ReactNode;
};

export const metadata: Metadata = {
  title: "WildHacks Guide",
  description: "The complete WildHacks 2026 event guide—schedule, logistics, judging details, and more.",
};

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const GuideLayout = ({ children }: GuideLayoutProps) => {
  return (
    <div className={`guide-theme ${figtree.className}`}>
      <header className="guide-header">
        <div className="guide-header-inner">
          <GuideSearch entries={GUIDE_SEARCH_ENTRIES} />
        </div>
      </header>
      <div className="guide-shell">
        <GuideNavigation />
        <main className="guide-content" role="main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default GuideLayout;
