/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // This allows production builds to complete despite ESLint errors
  },
  images: {
    domains: ['213.165.82.126'],  // Use your VM's IP address
  },
  generateEtags: false,  // Disable static page caching
};

export default nextConfig;
