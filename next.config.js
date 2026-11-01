/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server for the Docker image (Lattice stack 38).
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Thumbnails are immutable (unique filenames). The 4h default made the
    // optimizer re-fetch whole grids from OpenBucket at once, and fetches
    // past its 7s limit surfaced as 504s on /_next/image.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "content.hillview.tv",
      },
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
