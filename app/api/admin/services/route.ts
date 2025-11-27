import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    
    // サービス一覧とカテゴリを一度に取得（JOINクエリ）
    const { data: services, error } = await supabase
      .from('services')
      .select(`
        *,
        service_category_relations (
          service_categories (
            name
          )
        )
      `)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }

    // カテゴリ名を配列に変換
    const servicesWithCategories = (services || []).map(item => {
      const categories = item.service_category_relations
        ?.map((rel: any) => rel.service_categories?.name)
        .filter(Boolean) || [];
      
      const { service_category_relations, ...serviceItem } = item;
      return {
        ...serviceItem,
        categories
      };
    });

    return NextResponse.json(servicesWithCategories);
  } catch (error) {
    console.error("Failed to get services:", error);
    return NextResponse.json(
      { error: "Failed to get services" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();
    
    // 自動採番でスラッグを生成 (service-1, service-2, ...)
    const { data: existingServices } = await supabase
      .from('services')
      .select('slug')
      .like('slug', 'service-%')
      .order('created_at', { ascending: false });

    let maxNumber = 0;
    if (existingServices) {
      for (const item of existingServices) {
        const match = item.slug?.match(/^service-(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          // タイムスタンプ形式（10桁以上）は除外し、連番のみを対象とする
          if (num < 100000 && num > maxNumber) {
            maxNumber = num;
          }
        }
      }
    }
    const slug = `service-${maxNumber + 1}`;

    const { categories, ...dbService } = body;
    
    const serviceData = {
      ...dbService,
      slug,
      published: true,
      published_at: new Date().toISOString(),
    };

    const { data: newService, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      throw error;
    }

    // カテゴリのリレーションを一括作成
    if (newService && categories && categories.length > 0) {
      const { data: categoryData } = await supabase
        .from('service_categories')
        .select('id, name')
        .in('name', categories);

      if (categoryData && categoryData.length > 0) {
        const relations = categoryData.map(cat => ({
          service_id: newService.id,
          category_id: cat.id
        }));

        await supabase
          .from('service_category_relations')
          .insert(relations);
      }
    }

    // キャッシュを無効化
    revalidatePath('/');
    revalidatePath('/services');

    return NextResponse.json({ ...newService, categories: categories || [] });
  } catch (error) {
    console.error("Failed to create service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
