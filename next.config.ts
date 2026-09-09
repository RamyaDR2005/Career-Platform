import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/register",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
