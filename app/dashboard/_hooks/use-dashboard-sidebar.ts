"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { HEADER_TEXT_MAP } from "../constants";

export type UseDashboardSidebarReturn = {
  openSubMenus: Record<string, boolean>;
  handleOpenSubMenu: (title: string) => void;
  isPathActive: (url: string) => boolean;
  headerText: string;
};

export const useDashboardSidebar = (): UseDashboardSidebarReturn => {
  const pathname = usePathname();

  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

  const handleOpenSubMenu = (title: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [title]: !(prev[title] ?? false),
    }));
  };

  const headerText = useMemo(() => {
    const subpath = pathname.split("/").at(-1);
    return HEADER_TEXT_MAP[subpath ?? ""] || "Home";
  }, [pathname]);

  const isPathActive = (url: string) => pathname === url || pathname.startsWith(`${url}/`);

  return { openSubMenus, handleOpenSubMenu, isPathActive, headerText };
};
