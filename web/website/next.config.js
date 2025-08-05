// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/works/:slug*',
        destination: '/play/:slug*',
        permanent: true, // or false for temporary (307)
      },
    ]
  },
  reactStrictMode: false,
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
          loader: 'file-parser',
        },
      ],
    })

    // to load GLSL files
    config.module.rules.push({
      test: /\.(frag|vert)$/,
      use: 'raw-loader',
    })
    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  },
}

module.exports = nextConfig
