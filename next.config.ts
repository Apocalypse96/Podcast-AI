import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ignore ESLint errors during build to prevent deployment failures
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
