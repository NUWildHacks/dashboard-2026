import { createRequire } from "module";

import createMDX from "@next/mdx";
import type { NextConfig } from "next";

import { WILDHACKS_HOME } from "./constants/routes.constants";

const require = createRequire(import.meta.url);

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [require.resolve("remark-gfm")],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async redirects() {
    return [
      {
        source: WILDHACKS_HOME,
        destination: "https://www.wildhacks.net",
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default withMDX(nextConfig);
