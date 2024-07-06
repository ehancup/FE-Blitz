/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    IP: process.env.IP,
    SOCKET: process.env.SOCKET
  },
};

export default nextConfig;
