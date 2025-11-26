import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, slug, color } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid category name" }, { status: 400 });
    }

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const updateData: any = { name, slug };
    if (color) {
      updateData.color = color;
    }

    const { data, error } = await supabase
      .from('news_categories')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating news category:', error);
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating news category:", error);
    return NextResponse.json({ error: "Failed to update news category" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('news_categories')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting news category:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting news category:", error);
    return NextResponse.json({ error: "Failed to delete news category" }, { status: 500 });
  }
}
