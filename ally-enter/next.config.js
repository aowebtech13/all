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
          destination: 'http://127.0.0.1:8000/api/:path*',
        },
        {
          source: '/sanctum/:path*',
          destination: 'http://127.0.0.1:8000/sanctum/:path*',
        },
        {
          source: '/register',
          destination: 'http://127.0.0.1:8000/register',
        },
        {
          source: '/login',
          destination: 'http://127.0.0.1:8000/login',
        },
        {
          source: '/logout',
          destination: 'http://127.0.0.1:8000/logout',
        },
        {
          source: '/forgot-password',
          destination: 'http://127.0.0.1:8000/forgot-password',
        },
        {
          source: '/reset-password',
          destination: 'http://127.0.0.1:8000/reset-password',
        },
      ]
    },
  }
  
  module.exports = nextConfig
