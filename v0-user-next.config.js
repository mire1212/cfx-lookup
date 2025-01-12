/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    STEAM_API_KEY: process.env.STEAM_API_KEY,
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

