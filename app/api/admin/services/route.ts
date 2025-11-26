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
    
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
      throw error;
    }

    return NextResponse.json(services || []);
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
    
    // Generate slug from title or use timestamp as fallback
    let slug = body.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .substring(0, 100);
    
    // If slug is empty (e.g., Japanese title), use timestamp-based slug
    if (!slug || slug.length === 0) {
      slug = `service-${Date.now()}`;
    }

    // Prepare data for database (remove tags as it's not in DB schema)
    const { tags, ...dbService } = body;
    
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

    return NextResponse.json(newService);
  } catch (error) {
    console.error("Failed to create service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}



