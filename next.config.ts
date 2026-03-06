import type { NextConfig } from "next";

import { JUDGE_REGISTRATION_PATH, WILDHACKS_HOME, TECH_ROOM_FINDER_PATH } from "./constants/routes.constants";

const isDev = process.env.APP_ENV !== "production";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} ${isDev ? "https://vercel.live" : ""} https://*.firebaseapp.com https://apis.google.com;
  style-src 'self' ${isDev ? "https://vercel.live" : ""} 'unsafe-inline';
  img-src 'self' ${isDev ? "https://vercel.live https://vercel.com" : ""} blob: data:;
  font-src 'self' ${isDev ? "https://vercel.live https://assets.vercel.com" : ""} data:;
  connect-src 'self' ${isDev ? "https://vercel.live wss://ws-us3.pusher.com" : ""} https://*.firebaseapp.com https://*.googleapis.com https://github.com;
  frame-src 'self' ${isDev ? "https://vercel.live" : ""} https://*.firebaseapp.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: WILDHACKS_HOME,
        destination: "https://www.wildhacks.net",
        basePath: false,
        permanent: false,
      },
      {
        source: JUDGE_REGISTRATION_PATH,
        destination:
          "https://docs.google.com/forms/d/e/1FAIpQLScyJ4OXjGQOlXSNj-nAZzdcXA1eQWc1URs2fsVpe2dahjlzXw/viewform?usp=dialog",
        basePath: false,
        permanent: false,
      },
      {
        source: TECH_ROOM_FINDER_PATH,
        destination: "https://www.mccormick.northwestern.edu/contact/tech-room-finder.html",
        basePath: false,
        permanent: false,
      }
    ];
  },
};

export default nextConfig;
