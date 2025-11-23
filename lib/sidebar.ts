import { headerTextMap } from "@/constants/sidebar";

export const getHeaderText = (pathname: string) => {
  const subpath = pathname.split("/").at(-1);

  const headerText = headerTextMap[subpath ?? ""] || "Home";

  return headerText;
};
