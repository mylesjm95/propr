/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    quietDeps: true, // This will silence deprecation warnings
    silenceDeprecations: [
      "mixed-decls",
      "legacy-js-api",
      "import",
      "slash-div",
      "global-builtin",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'trreb-image.ampre.ca',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zzkofuuazojxdyqyjfsv.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Enable modern image formats
    formats: ['image/webp', 'image/avif'],
  },
  // Enable experimental features for better performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['@supabase/supabase_js', 'react-icons'],
  },
  // Enable compression
  compress: true,
  // Enable powered by header removal
  poweredByHeader: false,
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Server external packages configuration (moved from experimental.serverComponentsExternalPackages)
  serverExternalPackages: ['@prisma/client'],
};

module.exports = nextConfig;