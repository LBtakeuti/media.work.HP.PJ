import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// PUT: Update a service category
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

    // Generate slug from name
    let slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .substring(0, 100);

    if (!slug) {
      slug = `category-${Date.now()}`;
    }

    const updateData: any = {
      name,
      slug,
    };

    if (color) {
      updateData.color = color;
    }

    const { data, error } = await supabase
      .from('service_categories')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service category:', error);
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating service category:", error);
    return NextResponse.json({ error: "Failed to update service category" }, { status: 500 });
  }
}

// DELETE: Delete a service category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('service_categories')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting service category:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service category:", error);
    return NextResponse.json({ error: "Failed to delete service category" }, { status: 500 });
  }
}

