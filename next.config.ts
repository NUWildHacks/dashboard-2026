import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/wildhacks-home",
        destination: "https://www.wildhacks.net",
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
