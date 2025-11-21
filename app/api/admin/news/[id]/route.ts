import { NextResponse } from "next/server";
import { getNews, saveNews } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const news = await getNews();
    const item = news.find((n) => n.id === params.id);
    
    if (!item) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to get news:", error);
    return NextResponse.json(
      { error: "Failed to get news" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const news = await getNews();
    const index = news.findIndex((n) => n.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }
    
    news[index] = {
      ...body,
      id: params.id,
    };
    
    await saveNews(news);
    return NextResponse.json(news[index]);
  } catch (error) {
    console.error("Failed to update news:", error);
    return NextResponse.json(
      { error: "Failed to update news" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const news = await getNews();
    const filtered = news.filter((n) => n.id !== params.id);
    
    if (filtered.length === news.length) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }
    
    await saveNews(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete news:", error);
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
