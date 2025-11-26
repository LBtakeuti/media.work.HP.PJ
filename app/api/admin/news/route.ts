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

export async function GET() {
  try {
    const supabase = getSupabase();
    
    // まずニュース一覧を取得
    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      return NextResponse.json(
        { error: "Failed to get news" },
        { status: 500 }
      );
    }

    if (!news || news.length === 0) {
      return NextResponse.json([]);
    }

    // 全ニュースのカテゴリリレーションを一括取得
    const newsIds = news.map(n => n.id);
    const { data: relations } = await supabase
      .from('news_category_relations')
      .select('news_id, category_id')
      .in('news_id', newsIds);

    // カテゴリIDを一括取得
    const categoryIds = [...new Set((relations || []).map(r => r.category_id))];
    let categoriesMap: Record<string, string> = {};
    
    if (categoryIds.length > 0) {
      const { data: categories } = await supabase
        .from('news_categories')
        .select('id, name')
        .in('id', categoryIds);
      
      categoriesMap = (categories || []).reduce((acc, cat) => {
        acc[cat.id] = cat.name;
        return acc;
      }, {} as Record<string, string>);
    }

    // ニュースにカテゴリを付与
    const newsWithCategories = news.map(item => {
      const itemRelations = (relations || []).filter(r => r.news_id === item.id);
      const categories = itemRelations
        .map(r => categoriesMap[r.category_id])
        .filter(Boolean);
      
      return {
        ...item,
        categories
      };
    });

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
    const supabase = getSupabase();
    
    // 自動採番でスラッグを生成 (news-1, news-2, ...)
    const { data: existingNews } = await supabase
      .from('news')
      .select('slug')
      .like('slug', 'news-%')
      .order('created_at', { ascending: false });

    let maxNumber = 0;
    if (existingNews) {
      for (const item of existingNews) {
        const match = item.slug?.match(/^news-(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          // タイムスタンプ形式（10桁以上）は除外し、連番のみを対象とする
          if (num < 100000 && num > maxNumber) {
            maxNumber = num;
          }
        }
      }
    }
    const slug = `news-${maxNumber + 1}`;

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

    // カテゴリのリレーションを一括作成
    if (newNews && categories && categories.length > 0) {
      // カテゴリ名からIDを一括取得
      const { data: categoryData } = await supabase
        .from('news_categories')
        .select('id, name')
        .in('name', categories);

      if (categoryData && categoryData.length > 0) {
        const relations = categoryData.map(cat => ({
          news_id: newNews.id,
          category_id: cat.id
        }));

        await supabase
          .from('news_category_relations')
          .insert(relations);
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
