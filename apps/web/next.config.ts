import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mockforge/core", "@mockforge/formatters"],
  /* config options here */
};

export default nextConfig;
