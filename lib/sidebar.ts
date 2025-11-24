import { headerTextMap } from "@/constants/sidebar";

export function getHeaderText(pathname: string) { 
  const subpath = pathname.split("/").at(-1);

  const headerText = headerTextMap[subpath ?? ""] || "Home";

  return headerText;
};
