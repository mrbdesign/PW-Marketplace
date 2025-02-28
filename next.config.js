/** @type {import('next').NextConfig} */
const TerserPlugin = require('terser-webpack-plugin');

const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // Remove console.log statements
            },
          },
        }),
      ];
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'wasm-unsafe-eval' 'unsafe-eval' 'unsafe-inline' https://*.coinbase.com https://*.metamask.io https://*.thirdweb.com https://verify.walletconnect.com https://*.walletconnect.com",
              "frame-src 'self' https://*.coinbase.com https://*.metamask.io https://*.thirdweb.com https://embedded-wallet.thirdweb.com https://verify.walletconnect.com",
              "frame-ancestors 'self' https://*.coinbase.com https://*.metamask.io https://*.thirdweb.com",
              "connect-src 'self' https://* wss://* https://verify.walletconnect.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://* blob:",
              "worker-src 'self' blob:"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ],
      }
    ]
  }
}

module.exports = nextConfig
