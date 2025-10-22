import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ["192.168.29.51", "*.local", "nirvanaflow.vercel.app"], // Specify allowed origins here
  /* other config options */
};

export default nextConfig;
