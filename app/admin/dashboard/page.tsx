import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    {
      label: "ニュース記事数",
      value: "6",
      href: "/admin/news",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "サービス数",
      value: "6",
      href: "/admin/services",
      color: "bg-green-50 text-green-700",
    },
    {
      label: "タグ数",
      value: "12",
      href: "/admin/tags",
      color: "bg-purple-50 text-purple-700",
    },
  ];

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
      label: "タグを管理",
      href: "/admin/tags",
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ダッシュボード
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </Link>
        ))}
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
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">
              新サービス開始のお知らせ
            </p>
            <p className="text-xs text-gray-500 mt-1">2024年1月15日</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">
              ホームページをリニューアルしました
            </p>
            <p className="text-xs text-gray-500 mt-1">2024年1月10日</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">
              採用情報を更新しました
            </p>
            <p className="text-xs text-gray-500 mt-1">2024年1月5日</p>
          </div>
        </div>
      </div>
    </div>
  );
}
