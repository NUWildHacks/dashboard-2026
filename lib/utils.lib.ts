import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge.
 * Combines class names and resolves conflicts using Tailwind's merge utility.
 *
 * @param inputs - Variable number of class values (strings, objects, arrays, etc.)
 * @returns Merged class string with resolved Tailwind conflicts
 * @example
 * ```ts
 * const classes = cn("px-2 py-1", { "bg-red-500": true, "text-white": false }, ["rounded-md"]);
 * // Returns: "px-2 py-1 bg-red-500 rounded-md"
 *
 * const merged = cn("px-4 py-2", "px-2 py-1");
 * // Returns: "px-2 py-1" (later classes override earlier ones)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
