import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid category name" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // slugを自動生成
    let slug = name
      .toLowerCase()
      .replaceAll(/\s+/g, '-')
      .replaceAll(/[^\w\-]+/g, '')
      .substring(0, 100);

    if (!slug) {
      slug = `category-${Date.now()}`;
    }

    const updateData: any = { name, slug };
    if (color) {
      updateData.color = color;
    }

    const { data, error } = await supabase
      .from('portfolio_categories')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating portfolio category:', error);
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating portfolio category:", error);
    return NextResponse.json({ error: "Failed to update portfolio category" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('portfolio_categories')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting portfolio category:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting portfolio category:", error);
    return NextResponse.json({ error: "Failed to delete portfolio category" }, { status: 500 });
  }
}


