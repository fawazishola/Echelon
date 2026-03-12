/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: process.env.GITHUB_PAGES === "true" ? "/Echelon" : "",
  assetPrefix: process.env.GITHUB_PAGES === "true" ? "/Echelon/" : "",
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
