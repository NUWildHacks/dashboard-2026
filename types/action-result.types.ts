/**
 * Generic result type for server actions.
 * @template T - Optional form schema type for field-specific errors
 */
export type ActionResult<T = never> =
  | { success: true }
  | { success: false; error: string; field?: T extends never ? never : keyof T };
