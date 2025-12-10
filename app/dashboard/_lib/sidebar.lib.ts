import { headerTextMap } from "@/app/dashboard/_constants/sidebar.constant";

export function getHeaderText(pathname: string) {
  const subpath = pathname.split("/").at(-1);

  const headerText = headerTextMap[subpath ?? ""] || "Home";

  return headerText;
}
