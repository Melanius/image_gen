/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'dummy_key_for_build_process',
  },
  eslint: {
    ignoreDuringBuilds: true, // 빌드 중 ESLint 오류 무시
  },
  typescript: {
    ignoreBuildErrors: true, // 빌드 중 TypeScript 오류 무시
  },
};

module.exports = nextConfig; 