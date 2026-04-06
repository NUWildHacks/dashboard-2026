import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import type { ReactNode } from "react";

import { GuideShell } from "./_components/GuideShell";
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
      <GuideShell entries={GUIDE_SEARCH_ENTRIES}>{children}</GuideShell>
    </div>
  );
};

export default GuideLayout;
