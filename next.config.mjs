/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    IP: process.env.IP,
  },
};

export default nextConfig;
