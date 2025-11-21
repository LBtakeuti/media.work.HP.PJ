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
  title: "コーポレートサイト",
  description: "企業紹介とサービス概要",
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


