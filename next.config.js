/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.coinbase.com https://*.metamask.io",
              "frame-src 'self' https://*.coinbase.com https://*.metamask.io",
              "frame-ancestors 'self' https://*.coinbase.com https://*.metamask.io",
              "connect-src 'self' https://* wss://*",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://* blob:"
            ].join('; ')
          }
        ],
      }
    ]
  }
}

module.exports = nextConfig
