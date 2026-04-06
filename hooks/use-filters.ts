"use client";

import { useState } from "react";

export type CategoryWithAll<T extends string> = T | "all";

export type UseFiltersReturnWithAll<T extends string> = {
  category: CategoryWithAll<T>;
  setCategory: (category: CategoryWithAll<T>) => void;
  search: string;
  setSearch: (search: string) => void;
};

export type UseFiltersReturnWithoutAll<T extends string> = {
  category: T;
  setCategory: (category: T) => void;
  search: string;
  setSearch: (search: string) => void;
};

type UseFiltersOptionsWithAll<T extends string> = {
  includeAll: true;
  defaultCategory?: T;
};

type UseFiltersOptionsWithoutAll<T extends string> = {
  includeAll: false;
  defaultCategory: T;
};

type UseFiltersOptionsDefault<T extends string> = {
  includeAll?: true;
  defaultCategory?: T;
};

// Overload for includeAll: false (defaultCategory required)
export function useFilters<T extends string>(options: UseFiltersOptionsWithoutAll<T>): UseFiltersReturnWithoutAll<T>;

// Overload for includeAll: true or omitted (defaultCategory optional)
export function useFilters<T extends string>(
  options?: UseFiltersOptionsWithAll<T> | UseFiltersOptionsDefault<T>
): UseFiltersReturnWithAll<T>;

// Implementation
export function useFilters<T extends string>(
  options?: UseFiltersOptionsWithAll<T> | UseFiltersOptionsWithoutAll<T> | UseFiltersOptionsDefault<T>
): UseFiltersReturnWithAll<T> | UseFiltersReturnWithoutAll<T> {
  const includeAll = options?.includeAll ?? true;
  const defaultCategory = options?.defaultCategory;

  const initialCategory = includeAll ? ("all" as CategoryWithAll<T>) : (defaultCategory as T);

  const [category, setCategory] = useState<CategoryWithAll<T> | T>(initialCategory);
  const [search, setSearch] = useState<string>("");

  if (includeAll) {
    return {
      category: category as CategoryWithAll<T>,
      setCategory: setCategory as (category: CategoryWithAll<T>) => void,
      search,
      setSearch,
    } as UseFiltersReturnWithAll<T>;
  } else {
    return {
      category: category as T,
      setCategory: setCategory as (category: T) => void,
      search,
      setSearch,
    } as UseFiltersReturnWithoutAll<T>;
  }
}
