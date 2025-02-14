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
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx']
    }
    return config
  },
  experimental: {
    esmExternals: true
  }
}

module.exports = nextConfig
