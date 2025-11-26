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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (error || !news) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(news);
  } catch (error) {
    console.error("Failed to get news:", error);
    return NextResponse.json(
      { error: "Failed to get news" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();
    
    // tagsを除外してslugを生成
    const { tags, ...dbNews } = body;
    let updateData = dbNews;
    
    if (dbNews.title) {
      let slug = dbNews.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .substring(0, 100);
      
      // If slug is empty (e.g., Japanese title), use timestamp-based slug
      if (!slug || slug.length === 0) {
        slug = `news-${Date.now()}`;
      }
      
      updateData = {
        ...dbNews,
        slug,
      };
    }
    
    const { data: updatedNews, error } = await supabase
      .from('news')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating news:', error);
      throw error;
    }
    
    return NextResponse.json(updatedNews);
  } catch (error) {
    console.error("Failed to update news:", error);
    return NextResponse.json(
      { error: "Failed to update news" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();
    
    console.log('Attempting to delete news with ID:', params.id);
    
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', params.id);
    
    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
    
    console.log('News deleted successfully:', params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete news:", error);
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
