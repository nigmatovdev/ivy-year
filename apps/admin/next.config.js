/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ivyonaire/ui", "@ivyonaire/db", "@ivyonaire/utils"],
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;

