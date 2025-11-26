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

// GET: Fetch all news categories
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: categories, error } = await supabase
      .from('news_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching news categories:', error);
      throw error;
    }

    return NextResponse.json(categories || []);
  } catch (error) {
    console.error("Error reading news categories:", error);
    return NextResponse.json({ error: "Failed to load news categories" }, { status: 500 });
  }
}

// POST: Create a new news category
export async function POST(request: NextRequest) {
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

    // Get the highest sort_order
    const { data: existingCategories } = await supabase
      .from('news_categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextSortOrder = existingCategories && existingCategories.length > 0 
      ? (existingCategories[0].sort_order || 0) + 1 
      : 1;

    const newCategory = {
      name,
      slug,
      color: color || '#3B82F6',
      sort_order: nextSortOrder,
    };

    const { data, error } = await supabase
      .from('news_categories')
      .insert([newCategory])
      .select()
      .single();

    if (error) {
      console.error('Error creating news category:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: "Category already exists" }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating news category:", error);
    return NextResponse.json({ error: "Failed to create news category" }, { status: 500 });
  }
}

