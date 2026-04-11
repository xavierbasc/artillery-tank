/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/terrashell-fracture' : '',
  assetPrefix: isProd ? '/terrashell-fracture/' : '',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
