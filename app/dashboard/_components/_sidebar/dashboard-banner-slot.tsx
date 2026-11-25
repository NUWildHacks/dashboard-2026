"use client";

import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
} from "react";

/**
 * Height of the banner. The fixed desktop sidebar moves down by this value. The Tailwind classes
 * in dashboard-sidebar.tsx spell out the same name, so change both together.
 */
const DASHBOARD_BANNER_HEIGHT_VAR =
  "--dashboard-banner-height";

type DashboardBannerSlotProps = PropsWithChildren<{
  banner?: ReactNode;
}>;

/**
 * Shows an optional full-width banner above the dashboard (sidebar and content). The banner
 * stays at the top of the window while the page scrolls. The slot measures the banner, so a
 * banner of any height works: the measured height goes into `--dashboard-banner-height`, which
 * the sidebar reads.
 */
const DashboardBannerSlot = ({
  banner,
  children,
}: DashboardBannerSlotProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const hasBanner = Boolean(banner);

  useEffect(() => {
    const root = rootRef.current;
    const bannerElement = bannerRef.current;
    if (!hasBanner || !root || !bannerElement) return;

    const updateHeight = () =>
      root.style.setProperty(
        DASHBOARD_BANNER_HEIGHT_VAR,
        `${bannerElement.offsetHeight}px`
      );
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(bannerElement);

    return () => {
      observer.disconnect();
      root.style.removeProperty(
        DASHBOARD_BANNER_HEIGHT_VAR
      );
    };
  }, [hasBanner]);

  return (
    <div ref={rootRef}>
      {hasBanner && (
        <div
          ref={bannerRef}
          className="sticky top-0 z-20 w-full"
        >
          {banner}
        </div>
      )}
      {children}
    </div>
  );
};

export default DashboardBannerSlot;
