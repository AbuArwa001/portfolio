import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove Clerk-specific external packages since we're using Auth.js
  // serverComponentsExternalPackages has been moved to serverExternalPackages
  serverExternalPackages: [],
  images: {
    domains: ["localhost"], // Remove Clerk domain, add your own if needed
  },
  // Add this to fix the workspace root warning
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
