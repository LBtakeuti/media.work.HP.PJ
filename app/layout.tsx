import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const lineSeedJP = localFont({
  src: [
    {
      path: "../public/fonts/LINESeedJP_OTF_Rg.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/LINESeedJP_OTF_Bd.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-line-seed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "株式会社メディア・ワーク",
  description: "1975年創業、東京の印刷製版会社から進化したメディア制作のプロ集団。組版・グラフィックデザインからAI動画撮影サービスSAVREQ、Web制作まで、企画から運営までワンストップでサポート。伝統と革新を融合し、心に残る瞬間を未来へ届けます。",
  icons: {
    icon: "/favicon_logo1.svg",
    apple: "/favicon_logo1.svg",
  },
  openGraph: {
    title: "株式会社メディア・ワーク",
    description: "1975年創業、東京の印刷製版会社から進化したメディア制作のプロ集団。組版・グラフィックデザインからAI動画撮影サービスSAVREQ、Web制作まで、企画から運営までワンストップでサポート。伝統と革新を融合し、心に残る瞬間を未来へ届けます。",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://media-work.jp",
    siteName: "株式会社メディア・ワーク",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "株式会社メディア・ワーク",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "株式会社メディア・ワーク",
    description: "1975年創業、東京の印刷製版会社から進化したメディア制作のプロ集団。組版・グラフィックデザインからAI動画撮影サービスSAVREQ、Web制作まで、企画から運営までワンストップでサポート。伝統と革新を融合し、心に残る瞬間を未来へ届けます。",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={lineSeedJP.className}>
        {children}
      </body>
    </html>
  );
}


