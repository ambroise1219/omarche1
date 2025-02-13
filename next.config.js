/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io', 'localhost'],
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  webpack: (config) => {
    config.externals = [...config.externals, 'bcrypt', 'jsonwebtoken']
    return config
  }
}

module.exports = nextConfig
