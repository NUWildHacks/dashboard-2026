import type { NextConfig } from "next";

import { WILDHACKS_HOME } from "./constants/routes";

const nextConfig: NextConfig = {
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

export default nextConfig;
