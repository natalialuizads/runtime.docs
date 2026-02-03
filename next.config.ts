import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_PAGES === "true" ? "/runtime.docs" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
