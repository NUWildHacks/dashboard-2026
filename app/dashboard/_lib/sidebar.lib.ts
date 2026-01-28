import { HEADER_TEXT_MAP } from "../_constants";

/**
 * Get the header text for a given pathname based on the last segment of the path.
 * Maps the pathname's last segment to a header text from the sidebar constants.
 *
 * @param pathname - The full pathname string (e.g., "/dashboard/schedule", "/dashboard/project")
 * @returns The header text for the pathname, or "Home" if no mapping exists
 * @example
 * ```ts
 * const header1 = getHeaderText("/dashboard/schedule");
 * // Returns: "Schedule" (or mapped value from HEADER_TEXTMAP)
 *
 * const header2 = getHeaderText("/dashboard/project");
 * // Returns: "Project" (or mapped value from HEADER_TEXTMAP)
 *
 * const header3 = getHeaderText("/dashboard/unknown");
 * // Returns: "Home" (default fallback)
 * ```
 */
const getHeaderText = (pathname: string) => {
  const subpath = pathname.split("/").at(-1);

  const headerText = HEADER_TEXT_MAP[subpath ?? ""] || "Home";

  return headerText;
};

export { getHeaderText };
