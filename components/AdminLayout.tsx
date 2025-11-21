"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // 認証チェック
    const auth = localStorage.getItem("adminAuth");
    const user = localStorage.getItem("adminUser");

    if (auth === "true" && user) {
      setIsAuthenticated(true);
      setUsername(user);
      setIsLoading(false);
    } else {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    { name: "ダッシュボード", href: "/admin/dashboard", icon: "📊" },
    { name: "ニュース管理", href: "/admin/news", icon: "📰" },
    { name: "サービス管理", href: "/admin/services", icon: "🔧" },
    { name: "タグ管理", href: "/admin/tags", icon: "🏷️" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="メディア・ワーク"
              width={120}
              height={48}
              className="h-10 w-auto brightness-0 invert"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition-colors"
              title="ログアウト"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-gray-900">管理画面</h1>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-primary-600 transition-colors flex items-center gap-2"
          >
            <span>サイトを表示</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {/* Page Content */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

