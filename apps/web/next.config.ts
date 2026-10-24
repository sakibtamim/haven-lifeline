import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["@haven/shared", "@haven/tokens"],
  // Security headers to immunize against clickjacking & XSS
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ],
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: process.env.API_URL || "http://localhost:4000/api/:path*",
    },
  ],
};

export default nextConfig;
