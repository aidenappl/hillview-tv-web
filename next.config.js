/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['content.hillview.tv']
  },
  api: {
    responseLimit: false,
  },
}

module.exports = nextConfig
