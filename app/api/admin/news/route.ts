import { NextResponse } from "next/server";
import { getNews, saveNews } from "@/lib/data";

export async function GET() {
  try {
    const news = await getNews();
    return NextResponse.json(news);
  } catch (error) {
    console.error("Failed to get news:", error);
    return NextResponse.json(
      { error: "Failed to get news" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const news = await getNews();
    
    // Generate new ID
    const newId = String(Math.max(0, ...news.map(n => parseInt(n.id) || 0)) + 1);
    
    const newNews = {
      ...body,
      id: newId,
    };
    
    news.unshift(newNews);
    await saveNews(news);
    
    return NextResponse.json(newNews);
  } catch (error) {
    console.error("Failed to create news:", error);
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
}
