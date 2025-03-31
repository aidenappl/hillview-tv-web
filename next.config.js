/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "content.hillview.tv",
      "customer-nakrsdfbtn3mdz5z.cloudflarestream.com",
    ],
  },
  api: {
    responseLimit: false,
  },
};

module.exports = nextConfig;
