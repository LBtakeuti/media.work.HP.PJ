"use client";

import { useState } from "react";
import Link from "next/link";

interface MigrationResult {
  table: string;
  total: number;
  migrated: number;
  failed: number;
  errors: string[];
}

export default function MigrateImagesPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<MigrationResult[]>([]);
  const [currentTable, setCurrentTable] = useState<string>("");
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const runMigration = async () => {
    if (!confirm("既存のBase64画像をSupabase Storageに移行します。この処理には時間がかかる場合があります。続行しますか？")) {
      return;
    }

    setIsRunning(true);
    setResults([]);

    try {
      // ニュースの移行
      setCurrentTable("news");
      const newsResult = await migrateTable("news");
      setResults(prev => [...prev, newsResult]);

      // サービスの移行
      setCurrentTable("services");
      const servicesResult = await migrateTable("services");
      setResults(prev => [...prev, servicesResult]);

      // ポートフォリオの移行
      setCurrentTable("portfolio");
      const portfolioResult = await migrateTable("portfolio");
      setResults(prev => [...prev, portfolioResult]);

      setCurrentTable("");
      alert("移行が完了しました！");
    } catch (error) {
      console.error("Migration error:", error);
      alert("移行中にエラーが発生しました");
    } finally {
      setIsRunning(false);
      setProgress(null);
    }
  };

  const migrateTable = async (table: string): Promise<MigrationResult> => {
    const response = await fetch(`/api/admin/migrate-images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        table,
        total: 0,
        migrated: 0,
        failed: 0,
        errors: [error.error || "Unknown error"],
      };
    }

    return await response.json();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          画像移行ツール
        </h1>
        <p className="text-gray-600">
          Base64形式で保存されている画像をSupabase Storageに移行します
        </p>
        <Link
          href="/admin"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← 管理画面に戻る
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* 説明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">移行について</h2>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Base64形式の画像をSupabase Storageにアップロードします</li>
            <li>• DBの画像URLをStorage URLに更新します</li>
            <li>• 既にURL形式の画像はスキップされます</li>
            <li>• 移行後はページサイズが大幅に削減されます</li>
          </ul>
        </div>

        {/* 前提条件 */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-amber-800 mb-2">前提条件</h2>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Supabase Storageで「uploads」バケットを作成済みであること</li>
            <li>• バケットがPublic（公開）に設定されていること</li>
            <li>• 十分なストレージ容量があること</li>
          </ul>
        </div>

        {/* 実行ボタン */}
        <div className="flex justify-center">
          <button
            onClick={runMigration}
            disabled={isRunning}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {currentTable ? `${currentTable}を移行中...` : "処理中..."}
              </span>
            ) : (
              "移行を開始"
            )}
          </button>
        </div>

        {/* 結果表示 */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">移行結果</h2>
            {results.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  result.failed > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
                }`}
              >
                <h3 className="font-medium text-gray-900 mb-2">
                  {result.table === "news" && "ニュース"}
                  {result.table === "services" && "サービス"}
                  {result.table === "portfolio" && "ポートフォリオ"}
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">対象件数:</span>
                    <span className="ml-2 font-medium">{result.total}</span>
                  </div>
                  <div>
                    <span className="text-green-600">成功:</span>
                    <span className="ml-2 font-medium text-green-700">{result.migrated}</span>
                  </div>
                  <div>
                    <span className="text-red-600">失敗:</span>
                    <span className="ml-2 font-medium text-red-700">{result.failed}</span>
                  </div>
                </div>
                {result.errors.length > 0 && (
                  <div className="mt-2 text-xs text-red-600">
                    {result.errors.map((err, i) => (
                      <p key={i}>{err}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
