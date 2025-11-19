import { NextRequest, NextResponse } from "next/server";
import { getNews, saveNews } from "@/lib/data";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const news = await getNews();
    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "ニュースの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, date, category } = body;

    if (!title || !content || !date || !category) {
      return NextResponse.json(
        { error: "すべての項目を入力してください" },
        { status: 400 }
      );
    }

    const news = await getNews();
    const newItem = {
      id: randomUUID(),
      title,
      content,
      date,
      category,
    };

    news.unshift(newItem); // Add to beginning
    await saveNews(news);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error saving news:", error);
    return NextResponse.json(
      { error: "ニュースの保存に失敗しました" },
      { status: 500 }
    );
  }
}

