/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for Supabase integration
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_STATUS_API: process.env.NEXT_PUBLIC_STATUS_API || 'https://getgearshift.app/api/status',
    NEXT_PUBLIC_PLATFORM_STATS_API: process.env.NEXT_PUBLIC_PLATFORM_STATS_API || 'https://getgearshift.app/api/stats/platform',
  },
};

module.exports = nextConfig;
