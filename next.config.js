/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.109.65'],
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
}

module.exports = nextConfig
