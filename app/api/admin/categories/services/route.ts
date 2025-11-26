import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: categories, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching service categories:', error);
      throw error;
    }

    return NextResponse.json(categories || []);
  } catch (error) {
    console.error("Error reading service categories:", error);
    return NextResponse.json({ error: "Failed to load service categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid category name" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    let slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .substring(0, 100);

    if (!slug) {
      slug = `category-${Date.now()}`;
    }

    const { data: existingCategories } = await supabase
      .from('service_categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextSortOrder = existingCategories && existingCategories.length > 0 
      ? (existingCategories[0].sort_order || 0) + 1 
      : 1;

    const newCategory = {
      name,
      slug,
      color: color || '#10B981',
      sort_order: nextSortOrder,
    };

    const { data, error } = await supabase
      .from('service_categories')
      .insert([newCategory])
      .select()
      .single();

    if (error) {
      console.error('Error creating service category:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: "Category already exists" }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating service category:", error);
    return NextResponse.json({ error: "Failed to create service category" }, { status: 500 });
  }
}
