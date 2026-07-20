/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s.gravatar.com",
        pathname: "/avatar/**",
      },
      {
        protocol: "https",
        hostname: "cdn.auth0.com",
        pathname: "/avatars/**",
      },
    ],
  },
};

module.exports = nextConfig;
