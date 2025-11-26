"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  newsCount: number;
  servicesCount: number;
  categoriesCount: number;
}

interface RecentItem {
  id: string;
  title: string;
  date: string;
  type: 'news' | 'service';
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    newsCount: 0,
    servicesCount: 0,
    categoriesCount: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // ニュース数を取得
      const newsRes = await fetch("/api/admin/news");
      const newsData = await newsRes.json();
      const newsCount = Array.isArray(newsData) ? newsData.length : 0;

      // サービス数を取得
      const servicesRes = await fetch("/api/admin/services");
      const servicesData = await servicesRes.json();
      const servicesCount = Array.isArray(servicesData) ? servicesData.length : 0;

      // カテゴリ数を取得
      const newsCatRes = await fetch("/api/admin/categories/news");
      const newsCatData = await newsCatRes.json();
      const serviceCatRes = await fetch("/api/admin/categories/services");
      const serviceCatData = await serviceCatRes.json();
      const categoriesCount = 
        (Array.isArray(newsCatData) ? newsCatData.length : 0) +
        (Array.isArray(serviceCatData) ? serviceCatData.length : 0);

      setStats({
        newsCount,
        servicesCount,
        categoriesCount,
      });

      // 最近の更新を作成
      const recent: RecentItem[] = [];
      
      if (Array.isArray(newsData)) {
        newsData.slice(0, 3).forEach((item: any) => {
          recent.push({
            id: item.id,
            title: item.title,
            date: item.date,
            type: 'news',
          });
        });
      }

      setRecentItems(recent);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const quickActions = [
    {
      label: "新しいニュースを作成",
      href: "/admin/news/new",
      color: "bg-primary-600 hover:bg-primary-700",
    },
    {
      label: "新しいサービスを作成",
      href: "/admin/services/new",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      label: "カテゴリを管理",
      href: "/admin/categories/news",
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ダッシュボード
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/news"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-gray-600 mb-2">ニュース記事数</p>
          <p className="text-3xl font-bold text-gray-900">{stats.newsCount}</p>
        </Link>
        <Link
          href="/admin/services"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-gray-600 mb-2">サービス数</p>
          <p className="text-3xl font-bold text-gray-900">{stats.servicesCount}</p>
        </Link>
        <Link
          href="/admin/categories/news"
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-gray-600 mb-2">カテゴリ数</p>
          <p className="text-3xl font-bold text-gray-900">{stats.categoriesCount}</p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          クイックアクション
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`${action.color} text-white px-6 py-4 rounded-lg font-medium transition-colors text-center`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">最近の更新</h2>
        {recentItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">最近の更新はありません</p>
        ) : (
          <div className="space-y-3">
            {recentItems.map((item) => (
              <Link
                key={item.id}
                href={item.type === 'news' ? `/admin/news/${item.id}/edit` : `/admin/services/${item.id}/edit`}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p className="text-sm font-medium text-gray-900">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{formatDate(item.date)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
