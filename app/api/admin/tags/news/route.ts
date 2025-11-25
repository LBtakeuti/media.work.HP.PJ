import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Service role clientを使ってRLSをバイパス
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

// GET: Fetch all news tags
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: tags, error } = await supabase
      .from('news_tags')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching news tags:', error);
      throw error;
    }

    return NextResponse.json(tags || []);
  } catch (error) {
    console.error("Error reading news tags:", error);
    return NextResponse.json({ error: "Failed to load news tags" }, { status: 500 });
  }
}

// POST: Create a new news tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid tag name" }, { status: 400 });
    }

    // Create slug from name
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');

    const supabase = getSupabaseAdmin();
    
    const { data: newTag, error } = await supabase
      .from('news_tags')
      .insert([{
        name,
        slug,
        sort_order: 0,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating news tag:', error);
      throw error;
    }

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("Error creating news tag:", error);
    return NextResponse.json({ error: "Failed to create news tag" }, { status: 500 });
  }
}



