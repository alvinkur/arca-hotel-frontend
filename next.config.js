/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
      {
        source: '/ai-recommend',
        destination: 'http://localhost:8080/ai-recommend',
      },
      {
        source: '/ai-travel-plan',
        destination: 'http://localhost:8080/ai-travel-plan',
      },
    ];
  },
};

export default nextConfig;
