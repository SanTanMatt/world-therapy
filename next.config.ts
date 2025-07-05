import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  allowedDevOrigins: ['https://9dde-83-144-23-156.ngrok-free.app'], // Add your dev origin here
  reactStrictMode: false,
};

export default nextConfig;
