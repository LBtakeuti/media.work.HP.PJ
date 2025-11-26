import { NextRequest, NextResponse } from "next/server";
import { saveContact } from "@/lib/supabase-data";

// レート制限の設定
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5分（ミリ秒）
const RATE_LIMIT_MAX_REQUESTS = 3; // 最大送信数

// メールアドレスごとの送信履歴を保存（メモリ内）
const rateLimitStore = new Map<string, number[]>();

// 古いエントリを削除する関数
function cleanupOldEntries() {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [email, timestamps] of entries) {
    const validTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
    );
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(email);
    } else {
      rateLimitStore.set(email, validTimestamps);
    }
  }
}

// レート制限をチェックする関数
function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(email) || [];
  
  // 5分以内の送信をフィルタリング
  const recentTimestamps = timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );
  
  // 制限を超えているかチェック
  if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  // 新しい送信を記録
  recentTimestamps.push(now);
  rateLimitStore.set(email, recentTimestamps);
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "すべての項目を入力してください" },
        { status: 400 }
      );
    }

    // 古いエントリをクリーンアップ
    cleanupOldEntries();

    // レート制限をチェック
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        { error: "送信制限に達しました。しばらく時間をおいてから再度お試しください" },
        { status: 429 }
      );
    }

    await saveContact({
      name,
      email,
      subject,
      message,
      status: '未対応',
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error saving contact:", error);
    return NextResponse.json(
      { error: "送信に失敗しました" },
      { status: 500 }
    );
  }
}

