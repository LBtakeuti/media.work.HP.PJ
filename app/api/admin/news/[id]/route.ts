import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

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
    const supabase = getSupabase();
    
    // ニュースを取得
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

    // カテゴリリレーションを取得
    const { data: relations } = await supabase
      .from('news_category_relations')
      .select('category_id')
      .eq('news_id', params.id);

    // カテゴリ名を取得
    let categories: string[] = [];
    if (relations && relations.length > 0) {
      const categoryIds = relations.map(r => r.category_id);
      const { data: categoryData } = await supabase
        .from('news_categories')
        .select('name')
        .in('id', categoryIds);
      
      categories = (categoryData || []).map(c => c.name);
    }
    
    return NextResponse.json({ ...news, categories });
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
    const supabase = getSupabase();
    
    const { categories, ...dbNews } = body;
    let updateData: any = { ...dbNews };
    
    if (dbNews.title) {
      let slug = dbNews.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .substring(0, 100);
      
      if (!slug || slug.length === 0) {
        slug = `news-${Date.now()}`;
      }
      
      updateData.slug = slug;
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

    // カテゴリが提供された場合、リレーションを更新
    if (categories !== undefined) {
      // 既存のリレーションを削除
      await supabase
        .from('news_category_relations')
        .delete()
        .eq('news_id', params.id);

      // 新しいリレーションを一括作成
      if (categories && categories.length > 0) {
        const { data: categoryData } = await supabase
          .from('news_categories')
          .select('id, name')
          .in('name', categories);

        if (categoryData && categoryData.length > 0) {
          const relations = categoryData.map(cat => ({
            news_id: params.id,
            category_id: cat.id
          }));

          await supabase
            .from('news_category_relations')
            .insert(relations);
        }
      }
    }
    
    return NextResponse.json({ ...updatedNews, categories: categories || [] });
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
    const supabase = getSupabase();
    
    // カテゴリリレーションはCASCADEで自動削除される
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', params.id);
    
    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete news:", error);
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
