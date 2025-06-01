/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'en'],
    localeDetection: false,
  },
}

export default nextConfig
