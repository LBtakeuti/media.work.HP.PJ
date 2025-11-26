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

// PUT: Update a service tag
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid tag name" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .substring(0, 100);

    const updateData: any = {
      name,
      slug: slug || `tag-${Date.now()}`,
    };

    if (color) {
      updateData.color = color;
    }

    const { data, error } = await supabase
      .from('service_tags')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service tag:', error);
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating service tag:", error);
    return NextResponse.json({ error: "Failed to update service tag" }, { status: 500 });
  }
}

// DELETE: Delete a service tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('service_tags')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting service tag:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service tag:", error);
    return NextResponse.json({ error: "Failed to delete service tag" }, { status: 500 });
  }
}



