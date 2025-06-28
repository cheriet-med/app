import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Create the next-intl plugin
const withNextIntl = createNextIntlPlugin();

// Define your Next.js configuration
const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true, // Enable source maps for production
  //reactStrictMode: true,
  webpack: (config) => {
    // Avoid disabling cache unless absolutely necessary
     config.cache = false;
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/ds9qj3exf/**', // Replace `dhnn7xish` with your Cloudinary cloud name
      },
    ],
  },
 
};

// Export the configuration with the next-intl plugin applied
export default withNextIntl(nextConfig);



/**
 *  async headers() {
    return [
      {
        source: '/:locale', // Applies to all locales
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow', // Default for homepage
          },
        ],
      },
    ];
  },
 * 
 */