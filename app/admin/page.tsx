"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { NewsItem, ContactSubmission } from "@/lib/data";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"news" | "contacts">("news");
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "news") {
        const response = await fetch("/api/admin/news");
        const data = await response.json();
        setNewsItems(data);
      } else {
        const response = await fetch("/api/admin/contacts");
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("このニュースを削除しますか？")) return;

    try {
      const response = await fetch(`/api/admin/news/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("このお問い合わせを削除しますか？")) return;

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">管理画面</h1>
          <p className="text-gray-600">ニュースとお問い合わせを管理できます。</p>
          <div className="mt-4">
            <Link
              href="/admin/images"
              className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              画像管理
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("news")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "news"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              ニュース管理
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "contacts"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              お問い合わせ管理
            </button>
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        ) : (
          <>
            {activeTab === "news" && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">ニュース一覧</h2>
                  <Link
                    href="/admin/news/new"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    新規作成
                  </Link>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          日付
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          カテゴリ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          タイトル
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {newsItems.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                            ニュースがありません
                          </td>
                        </tr>
                      ) : (
                        newsItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(new Date(item.date), "yyyy年MM月dd日", {
                                locale: ja,
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded">
                                {item.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {item.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Link
                                href={`/admin/news/${item.id}`}
                                className="text-primary-600 hover:text-primary-900 mr-4"
                              >
                                編集
                              </Link>
                              <button
                                onClick={() => handleDeleteNews(item.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                削除
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "contacts" && (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">お問い合わせ一覧</h2>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          日時
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          お名前
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          メールアドレス
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          件名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {contacts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                            お問い合わせがありません
                          </td>
                        </tr>
                      ) : (
                        contacts.map((contact) => (
                          <tr key={contact.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {format(new Date(contact.createdAt), "yyyy年MM月dd日 HH:mm", {
                                locale: ja,
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {contact.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {contact.email}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {contact.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  alert(`メッセージ:\n${contact.message}`);
                                }}
                                className="text-primary-600 hover:text-primary-900 mr-4"
                              >
                                詳細
                              </button>
                              <button
                                onClick={() => handleDeleteContact(contact.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                削除
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

