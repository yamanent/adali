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
  // The i18n configuration is removed as it's not compatible with app directory
  // Internationalization is now handled through the app directory structure
}

export default nextConfig
