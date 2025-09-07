// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "portfolio-nq7u72ays-khalfanathman12s-projects.vercel.app",
      },
      {
        protocol: "https",
        hostname: "portfolio-3ke7.onrender.com",
      },
      {
        protocol: "https",
        hostname: "www.khalfanathman.dev",
      },
      {
        protocol: "https",
        hostname: "khalfanathman.dev",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github-readme-stats.vercel.app",
      },
      {
        protocol: "https",
        hostname: "github-readme-streak-stats.herokuapp.com",
      },
      {
        protocol: "https",
        hostname: "github-profile-trophy.vercel.app",
      },
      {
        protocol: "https",
        hostname: "github-profile-summary-cards.vercel.app",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;

// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
