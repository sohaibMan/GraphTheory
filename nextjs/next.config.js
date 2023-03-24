/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9091",
        pathname: "/api/**",
      },
    ],
  },
};

module.exports = nextConfig;
