import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

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

// GET: Fetch all service tags
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data: tags, error } = await supabase
      .from('service_tags')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching service tags:', error);
      throw error;
    }

    return NextResponse.json(tags || []);
  } catch (error) {
    console.error("Error reading service tags:", error);
    return NextResponse.json({ error: "Failed to load service tags" }, { status: 500 });
  }
}

// POST: Create a new service tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid tag name" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .substring(0, 100);

    // Get the highest sort_order
    const { data: existingTags } = await supabase
      .from('service_tags')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1);

    const nextSortOrder = existingTags && existingTags.length > 0 
      ? (existingTags[0].sort_order || 0) + 1 
      : 1;

    const newTag = {
      name,
      slug: slug || `tag-${Date.now()}`,
      color: color || '#6B7280',
      sort_order: nextSortOrder,
    };

    const { data, error } = await supabase
      .from('service_tags')
      .insert([newTag])
      .select()
      .single();

    if (error) {
      console.error('Error creating service tag:', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: "Tag already exists" }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating service tag:", error);
    return NextResponse.json({ error: "Failed to create service tag" }, { status: 500 });
  }
}



