"use client";

import { useState } from "react";

export type CategoryWithAll<T extends string> = T | "all";

export type UseFiltersReturn<T extends string> = {
  category: CategoryWithAll<T>;
  setCategory: (category: CategoryWithAll<T>) => void;
  search: string;
  setSearch: (search: string) => void;
};

export const useFilters = <T extends string>(): UseFiltersReturn<T> => {
  const [category, setCategory] = useState<CategoryWithAll<T>>("all" as CategoryWithAll<T>);
  const [search, setSearch] = useState<string>("");

  return {
    category,
    setCategory,
    search,
    setSearch,
  };
};
