/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/simple-business-card' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/simple-business-card/' : '',
}

module.exports = nextConfig
