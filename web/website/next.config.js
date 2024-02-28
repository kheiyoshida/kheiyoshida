// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['sketch-components'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ttf$/i,
      use: [
        {
          loader: 'file-loader',
        },
      ],
    })
    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
