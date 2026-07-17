/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          pathname: '/**',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8000',
          pathname: '/**',
        },
      ],
    },
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://livinus-backend-api.lexicron.org/api/:path*',
        },
        {
          source: '/sanctum/:path*',
          destination: 'https://livinus-backend-api.lexicron.org/sanctum/:path*',
        },
        {
          source: '/register',
          destination: 'https://livinus-backend-api.lexicron.org/api/register',
        },
        {
          source: '/login',
          destination: 'https://livinus-backend-api.lexicron.org/api/login',
        },
        {
          source: '/logout',
          destination: 'https://livinus-backend-api.lexicron.org/api/logout',
        },
        {
          source: '/forgot-password',
          destination: 'https://livinus-backend-api.lexicron.org/api/forgot-password',
        },
        {
          source: '/reset-password',
          destination: 'https://livinus-backend-api.lexicron.org/api/reset-password',
        },
      ]
    },
  }
  
  module.exports = nextConfig
