import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output export for Vercel deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig;
