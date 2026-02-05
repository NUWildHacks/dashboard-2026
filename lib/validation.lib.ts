import { z } from "zod";

/**
 * Secure URL schema that only allows http:// and https:// protocols.
 * Prevents XSS attacks from dangerous protocols like javascript:, data:, file:, etc.
 *
 * @example
 * ```ts
 * const schema = z.object({
 *   url: secureUrlSchema,
 * });
 * ```
 */
export const secureUrlSchema = z.url("Invalid URL format").refine(
  (url) => {
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  },
  { message: "URL must use http:// or https:// protocol" }
);
