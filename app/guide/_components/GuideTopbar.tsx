"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { GuideSearchEntry } from "../_data/guide-search-data";

import { GuideSearch } from "./GuideSearch";
import { GuideThemeToggle } from "./GuideThemeToggle";

type GuideTopbarProps = {
  entries: GuideSearchEntry[];
  isNavigationOpen: boolean;
  onToggleNavigation: () => void;
};

const GuideTopbar = ({ entries, isNavigationOpen, onToggleNavigation }: GuideTopbarProps) => {
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
          <button
            type="button"
            className="guide-topbar-menu-button"
            aria-label={isNavigationOpen ? "Close guide menu" : "Open guide menu"}
            aria-controls="guide-navigation-panel"
            aria-expanded={isNavigationOpen}
            onClick={onToggleNavigation}
          >
            {isNavigationOpen ? (
              <X className="guide-topbar-menu-icon" aria-hidden />
            ) : (
              <Menu className="guide-topbar-menu-icon" aria-hidden />
            )}
          </button>
          <GuideThemeToggle />
          <GuideSearch entries={entries} />
        </div>
      </div>
    </header>
  );
};

export { GuideTopbar };
