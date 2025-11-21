"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip authentication check for login page
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    // Check authentication
    const authenticated = sessionStorage.getItem("adminAuthenticated");
    if (authenticated === "true") {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    sessionStorage.removeItem("adminLoginTime");
    router.push("/admin/login");
  };

  // Show login page without layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  // Show admin layout only if authenticated
  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { href: "/admin/dashboard", label: "ダッシュボード" },
    { href: "/admin/news", label: "ニュース管理" },
    { href: "/admin/services", label: "サービス管理" },
    { href: "/admin/tags/news", label: "ニュースタグマスタ" },
    { href: "/admin/tags/services", label: "サービスタグマスタ" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image
                src="/logo.jpg"
                alt="株式会社メディア・ワーク"
                width={150}
                height={48}
                className="h-12 w-auto"
              />
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                サイトを表示
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

