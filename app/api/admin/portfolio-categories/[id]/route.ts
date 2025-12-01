import { NextRequest, NextResponse } from "next/server";
import {
  getPortfolioCategoryById,
  updatePortfolioCategory,
  deletePortfolioCategory,
} from "@/lib/supabase-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await getPortfolioCategoryById(id);

    if (!category) {
      return NextResponse.json(
        { error: "カテゴリが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Failed to fetch portfolio category:", error);
    return NextResponse.json(
      { error: "カテゴリの取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, sort_order } = body;

    if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
      return NextResponse.json(
        { error: "カテゴリ名は空にできません" },
        { status: 400 }
      );
    }

    const updateData: { name?: string; sort_order?: number } = {};
    if (name !== undefined) updateData.name = name.trim();
    if (sort_order !== undefined) updateData.sort_order = sort_order;

    const category = await updatePortfolioCategory(id, updateData);
    return NextResponse.json(category);
  } catch (error: unknown) {
    console.error("Failed to update portfolio category:", error);

    // 重複エラーの場合
    if (error && typeof error === 'object' && 'code' in error && error.code === "23505") {
      return NextResponse.json(
        { error: "同じ名前のカテゴリが既に存在します" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "カテゴリの更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deletePortfolioCategory(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete portfolio category:", error);
    return NextResponse.json(
      { error: "カテゴリの削除に失敗しました" },
      { status: 500 }
    );
  }
}
