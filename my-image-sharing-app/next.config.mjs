/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true, // This allows production builds to complete despite ESLint errors
    },
  };
  
  export default nextConfig;