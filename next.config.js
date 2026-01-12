/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "content.hillview.tv",
      },
      {
        protocol: "https",
        hostname: "customer-nakrsdfbtn3mdz5z.cloudflarestream.com",
      },
    ],
  },
};

module.exports = nextConfig;
