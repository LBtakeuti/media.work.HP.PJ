import { NextRequest, NextResponse } from "next/server";
import { getPortfolioCategories, createPortfolioCategory } from "@/lib/supabase-data";

export async function GET() {
  try {
    const categories = await getPortfolioCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch portfolio categories:", error);
    return NextResponse.json(
      { error: "カテゴリの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, sort_order = 0 } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "カテゴリ名は必須です" },
        { status: 400 }
      );
    }

    const category = await createPortfolioCategory({
      name: name.trim(),
      sort_order,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to create portfolio category:", error);

    // 重複エラーの場合
    if (error && typeof error === 'object' && 'code' in error && error.code === "23505") {
      return NextResponse.json(
        { error: "同じ名前のカテゴリが既に存在します" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "カテゴリの作成に失敗しました" },
      { status: 500 }
    );
  }
}
