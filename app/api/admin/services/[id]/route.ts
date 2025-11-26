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
    
    return NextResponse.json(service);
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
    
    // tagsを除外してslugを生成
    const { tags, ...dbService } = body;
    let updateData = dbService;
    
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
      
      updateData = {
        ...dbService,
        slug,
      };
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
    
    return NextResponse.json(updatedService);
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
