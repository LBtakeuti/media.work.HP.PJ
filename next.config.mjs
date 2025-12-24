/** @type {import('next').NextConfig} */
const nextConfig = {
  // 画像最適化の設定
  images: {
    // リモート画像のドメインを許可（必要に応じて追加）
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qazyoxligvjsasfqettg.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // 画像フォーマットの最適化
    formats: ['image/avif', 'image/webp'],
  },
  // 本番ビルドの最適化
  compiler: {
    // 本番環境でconsole.logを削除
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // 実験的機能
  experimental: {
    // サーバーアクションの最適化
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // savreqgolflpはpublicフォルダに配置済み
};

export default nextConfig;

