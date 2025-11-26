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
    
    // サービス本体を取得
    const { data: service, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (error || !service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // カテゴリ情報を取得
    const { data: relations } = await supabase
      .from('service_category_relations')
      .select('category_id')
      .eq('service_id', params.id);

    let categories: string[] = [];
    if (relations && relations.length > 0) {
      const categoryIds = relations.map(r => r.category_id);
      const { data: categoryData } = await supabase
        .from('service_categories')
        .select('name')
        .in('id', categoryIds);
      
      categories = categoryData?.map(c => c.name) || [];
    }
    
    return NextResponse.json({ ...service, categories });
  } catch (error) {
    console.error("Failed to get service:", error);
    return NextResponse.json(
      { error: "Failed to get service" },
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
    
    // categoriesを除外してDBに保存するデータを準備
    const { categories, ...dbService } = body;
    let updateData: any = { ...dbService };
    
    if (dbService.title) {
      let slug = dbService.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .substring(0, 100);
      
      // If slug is empty (e.g., Japanese title), use timestamp-based slug
      if (!slug || slug.length === 0) {
        slug = `service-${Date.now()}`;
      }
      
      updateData.slug = slug;
    }
    
    // サービスを更新
    const { data: updatedService, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating service:', error);
      throw error;
    }

    // カテゴリが提供された場合、リレーションを更新
    if (categories !== undefined) {
      // 既存のリレーションを削除
      await supabase
        .from('service_category_relations')
        .delete()
        .eq('service_id', params.id);

      // 新しいリレーションを作成
      if (categories && categories.length > 0) {
        for (const categoryName of categories) {
          const { data: categoryData } = await supabase
            .from('service_categories')
            .select('id')
            .eq('name', categoryName)
            .single();

          if (categoryData) {
            await supabase
              .from('service_category_relations')
              .insert({
                service_id: params.id,
                category_id: categoryData.id
              });
          }
        }
      }
    }
    
    return NextResponse.json({ ...updatedService, categories: categories || [] });
  } catch (error) {
    console.error("Failed to update service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
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
    
    console.log('Attempting to delete service with ID:', params.id);
    
    // カテゴリリレーションはCASCADEで自動削除される
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', params.id);
    
    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
    
    console.log('Service deleted successfully:', params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
