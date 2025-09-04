// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "portfolio-nq7u72ays-khalfanathman12s-projects.vercel.app",
      },
      {
        protocol: "https",
        hostname: "portfolio-3ke7.onrender.com",
      },
      {
        protocol: "https",
        hostname: "www.khalfanathman.dev",
      },
      {
        protocol: "https",
        hostname: "khalfanathman.dev",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github-readme-stats.vercel.app",
      },
      {
        protocol: "https",
        hostname: "github-readme-streak-stats.herokuapp.com",
      },
      {
        protocol: "https",
        hostname: "github-profile-trophy.vercel.app",
      },
      {
        protocol: "https",
        hostname: "github-profile-summary-cards.vercel.app",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  outputFileTracingRoot: __dirname,

  // ADD THIS SECTION for API rewrites
  async rewrites() {
    // const isDevelopment = process.env.NODE_ENV === "development";
    const djangoBaseURL =
      process.env.DJANGO_BASE_URL || "http://localhost:8000";

    return [
      {
        source: "/api/django/:path*",
        destination: `${djangoBaseURL}/api/:path*`,
      },
      {
        source: "/api/auth/:path*",
        destination: "/api/auth/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
