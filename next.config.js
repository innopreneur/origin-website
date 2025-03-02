const locales = require('./locales');

const { NEXT_LEGACY_WEBSITE_HOST, STRAPI_API_URL, NEXT_PUBLIC_DISCORD_URL, NEXT_PUBLIC_TELEGRAM_URL, APP_ENV } = process.env

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true
  }
}

// API endpoints that should be forwarded to the legacy site
const legacyAPIPaths = [
  '/total-ogn',
  '/total-ogv',
  '/total-ousd',
  '/circulating-ogn',
  '/circulating-ogv',
  '/social-stats',
  '/mailing-list/:action*',
]

// Map legacy routes to new ones here
const legacyPageMappings = [
  // [source, destination]
  ['/dashboard', '/'],
  ['/presale', '/'],
  ['/tokens', '/'],

  ['/product', '/'],
  ['/ogn-token', '/'],

  ['/investors', '/community'],
  ['/team', '/community'],
  ['/about', '/community'],

  ['/company', '/blog'],

  ['/discord', `${NEXT_PUBLIC_DISCORD_URL}`],
  ['/telegram', `${NEXT_PUBLIC_TELEGRAM_URL}`],

  // Other dead paths:
  ['/apple-app-site-association', '/'],
  ['/mobile/apk', '/'],
  ['/whitepaper.pdf', '/'],
  ['/ios', '/'],
  ['/android', '/'],
  ['/lupefiasco', '/'],
  ['/dapp', '/'],
  ['/rewards', '/'],
  ['/whitepaper', '/'],
  ['/privacy/extension', '/'],
  ['/aup', '/'],
  ['/creator', '/'],
  ['/litepaper', '/'],
  ['/browser-extension', '/'],
  ['/huobi-launch', '/'],
  ['/reward', '/'],
  ['/reward/:path*', '/:path*'],

  // Forward to legacy site
  ['/developers', 'https://github.com/OriginProtocol'],
  ['/nft-terms', `${NEXT_LEGACY_WEBSITE_HOST}/nft-terms`],
]

const legacyAPIRedirects = legacyAPIPaths.map(path => ({
  source: path,
  destination: `${NEXT_LEGACY_WEBSITE_HOST}${path}`,
  // For some weird reason, locale is enabled on API endpoints
  // on the legacy python stack
  // locale: false,
  permanent: true
}))

const legacyPageRedirects = legacyPageMappings.map(([source, destination]) => ({
  source,
  destination,
  permanent: true
}))

const moduleExports = {
  ...nextConfig,
  reactStrictMode: true,
  images: {
    loader: "default",
    domains: ["localhost", "0.0.0.0", "cmsmediaproduction.s3.amazonaws.com", "cmsmediastaging.s3.amazonaws.com", "avatars.githubusercontent.com"],
  },
  i18n: {
    locales,
    defaultLocale: 'en',
  },
  experimental: { images: { allowFutureImage: true } },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "frame-ancestors 'none'",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Cross-Origin-Opener-Policy-Report-Only',
            value: 'same-origin-allow-popups'
          }
        ],
      },
    ];
  },
  async redirects() {
    return [
      ...legacyAPIRedirects,
      ...legacyPageRedirects,
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [{
        source: '/sitemap.xml',
        destination: `${STRAPI_API_URL}/api/website/sitemap`
      }, {
        source: '/robots.txt',
        destination: APP_ENV === 'prod' ? '/robots.prod.txt' : '/robots.staging.txt',
      }]
    }
  },
};

module.exports = moduleExports
