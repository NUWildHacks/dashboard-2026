import { useState } from "react";

export type UseAnnouncementsDisplayReturn = {
  display: "list" | "table";
  setDisplay: (display: "list" | "table") => void;
};

export const useAnnouncementsDisplay = (): UseAnnouncementsDisplayReturn => {
  const [display, setDisplay] = useState<"list" | "table">("list");

  return {
    display,
    setDisplay,
  };
};
