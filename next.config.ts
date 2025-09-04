import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ermöglicht standalone output für Docker
  output: "standalone",

  // Optimierungen für Production
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-tooltip"],
  },

  // Image-Konfiguration falls externe Bilder verwendet werden
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
