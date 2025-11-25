import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      throw error;
    }

    return NextResponse.json(news || []);
  } catch (error) {
    console.error("Failed to get news:", error);
    return NextResponse.json(
      { error: "Failed to get news" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();
    
    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .substring(0, 100);

    // Prepare data for database (remove tags as it's not in DB schema)
    const { tags, ...dbNews } = body;
    
    const newsData = {
      ...dbNews,
      slug,
      published: true,
      published_at: new Date().toISOString(),
    };

    const { data: newNews, error } = await supabase
      .from('news')
      .insert([newsData])
      .select()
      .single();

    if (error) {
      console.error('Error creating news:', error);
      throw error;
    }

    return NextResponse.json(newNews);
  } catch (error) {
    console.error("Failed to create news:", error);
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
}
