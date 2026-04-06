import type { ComponentType } from "react";

type MDXComponents = Record<string, ComponentType<object>>;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
