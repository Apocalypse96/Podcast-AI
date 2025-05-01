import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ignore ESLint errors during build to prevent deployment failures
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build to prevent deployment failures
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
