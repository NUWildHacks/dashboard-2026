"use client";

import Image from "next/image";
import Link from "next/link";

import type { GuideSearchEntry } from "../_data/guide-search-data";

import { GuideSearch } from "./GuideSearch";
import { GuideThemeToggle } from "./GuideThemeToggle";

type GuideTopbarProps = {
  entries: GuideSearchEntry[];
};

const GuideTopbar = ({ entries }: GuideTopbarProps) => {
  return (
    <header className="guide-topbar" role="banner">
      <div className="guide-topbar-inner">
        <Link href="/guide" className="guide-topbar-brand" aria-label="WildHacks Guide home">
          <Image
            src="/web-app-manifest-192x192.png"
            alt=""
            width={32}
            height={32}
            className="guide-topbar-logo"
            aria-hidden
          />
          <span className="guide-topbar-title">WildHacks Guide</span>
        </Link>
        <div className="guide-topbar-actions">
          <GuideThemeToggle />
          <GuideSearch entries={entries} />
        </div>
      </div>
    </header>
  );
};

export { GuideTopbar };
