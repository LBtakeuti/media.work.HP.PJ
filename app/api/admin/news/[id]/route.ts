import { NextRequest, NextResponse } from "next/server";
import { getNews, saveNews } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const news = await getNews();
    const item = news.find((n) => n.id === params.id);

    if (!item) {
      return NextResponse.json(
        { error: "ニュースが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "ニュースの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const index = news.findIndex((n) => n.id === params.id);

    if (index === -1) {
      return NextResponse.json(
        { error: "ニュースが見つかりません" },
        { status: 404 }
      );
    }

    news[index] = {
      ...news[index],
      title,
      content,
      date,
      category,
    };

    await saveNews(news);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "ニュースの更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const news = await getNews();
    const filteredNews = news.filter((n) => n.id !== params.id);

    if (news.length === filteredNews.length) {
      return NextResponse.json(
        { error: "ニュースが見つかりません" },
        { status: 404 }
      );
    }

    await saveNews(filteredNews);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "ニュースの削除に失敗しました" },
      { status: 500 }
    );
  }
}


