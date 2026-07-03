import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false, // Use false so it doesn't cache permanently if you ever change it back
      },
    ];
  },
};

export default nextConfig;
