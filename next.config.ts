import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "frame-ancestors 'self' https://americanhealthequity.org https://*.squarespace.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
