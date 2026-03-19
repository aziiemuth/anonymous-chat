import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/7.x/**',
      },
    ],
  },
  experimental: {
    // @ts-ignore - resolve cross-origin request warning for local development
    allowedDevOrigins: ['0.0.0.0'],
  },
};

export default nextConfig;
