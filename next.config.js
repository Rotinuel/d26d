/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cacheComponents: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
