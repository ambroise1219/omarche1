/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io', 'localhost'],
    unoptimized: true,
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js'
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
  },
  output: 'standalone'
}

module.exports = nextConfig
