import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseAdmin();
    
    // サービスとカテゴリを一度に取得
    const { data: service, error } = await supabase
      .from('services')
      .select(`
        *,
        service_category_relations (
          service_categories (
            name
          )
        )
      `)
      .eq('id', params.id)
      .single();
    
    if (error || !service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // カテゴリ名を配列に変換
    const categories = service.service_category_relations
      ?.map((rel: any) => rel.service_categories?.name)
      .filter(Boolean) || [];
    
    const { service_category_relations, ...serviceItem } = service;
    
    return NextResponse.json({ ...serviceItem, categories });
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
    
    const { categories, ...dbService } = body;
    let updateData: any = { ...dbService };
    
    if (dbService.title) {
      let slug = dbService.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .substring(0, 100);
      
      if (!slug || slug.length === 0) {
        slug = `service-${Date.now()}`;
      }
      
      updateData.slug = slug;
    }
    
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
      await supabase
        .from('service_category_relations')
        .delete()
        .eq('service_id', params.id);

      if (categories && categories.length > 0) {
        const { data: categoryData } = await supabase
          .from('service_categories')
          .select('id, name')
          .in('name', categories);

        if (categoryData && categoryData.length > 0) {
          const relations = categoryData.map(cat => ({
            service_id: params.id,
            category_id: cat.id
          }));

          await supabase
            .from('service_category_relations')
            .insert(relations);
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
    
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', params.id);
    
    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
