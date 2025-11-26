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
    
    // ニュース一覧を取得
    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      throw error;
    }

    // 各ニュースにカテゴリ情報を追加
    const newsWithCategories = await Promise.all(
      (news || []).map(async (item) => {
        const { data: relations } = await supabase
          .from('news_category_relations')
          .select('category_id')
          .eq('news_id', item.id);

        if (relations && relations.length > 0) {
          const categoryIds = relations.map(r => r.category_id);
          const { data: categories } = await supabase
            .from('news_categories')
            .select('name')
            .in('id', categoryIds);
          
          return {
            ...item,
            categories: categories?.map(c => c.name) || []
          };
        }
        return { ...item, categories: [] };
      })
    );

    return NextResponse.json(newsWithCategories);
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
    
    // Generate slug from title or use timestamp as fallback
    let slug = body.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .substring(0, 100);
    
    // If slug is empty (e.g., Japanese title), use timestamp-based slug
    if (!slug || slug.length === 0) {
      slug = `news-${Date.now()}`;
    }

    // Prepare data for database (remove categories as it's managed via relations)
    const { categories, ...dbNews } = body;
    
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

    // カテゴリのリレーションを作成
    if (newNews && categories && categories.length > 0) {
      for (const categoryName of categories) {
        const { data: categoryData } = await supabase
          .from('news_categories')
          .select('id')
          .eq('name', categoryName)
          .single();

        if (categoryData) {
          await supabase
            .from('news_category_relations')
            .insert({
              news_id: newNews.id,
              category_id: categoryData.id
            });
        }
      }
    }

    return NextResponse.json({ ...newNews, categories: categories || [] });
  } catch (error) {
    console.error("Failed to create news:", error);
    return NextResponse.json(
      { error: "Failed to create news" },
      { status: 500 }
    );
  }
}
