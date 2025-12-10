import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type CategoryTable = 'news_categories' | 'portfolio_categories' | 'service_categories';

interface CategoryConfig {
  tableName: CategoryTable;
  defaultColor: string;
  entityName: string;
}

function generateSlug(name: string): string {
  let slug = name
    .toLowerCase()
    .replaceAll(/\s+/g, '-')
    .replaceAll(/[^\w\-]+/g, '')
    .substring(0, 100);

  if (!slug) {
    slug = `category-${Date.now()}`;
  }
  return slug;
}

export function createCategoryHandlers(config: CategoryConfig) {
  const { tableName, defaultColor, entityName } = config;

  async function GET() {
    try {
      const supabase = getSupabaseAdmin();

      const { data: categories, error } = await supabase
        .from(tableName)
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error(`Error fetching ${entityName} categories:`, error);
        throw error;
      }

      return NextResponse.json(categories || []);
    } catch (error) {
      console.error(`Error reading ${entityName} categories:`, error);
      return NextResponse.json({ error: `Failed to load ${entityName} categories` }, { status: 500 });
    }
  }

  async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const { name, color } = body;

      if (!name || typeof name !== "string") {
        return NextResponse.json({ error: "Invalid category name" }, { status: 400 });
      }

      const supabase = getSupabaseAdmin();
      const slug = generateSlug(name);

      const { data: existingCategories } = await supabase
        .from(tableName)
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1);

      const nextSortOrder = existingCategories && existingCategories.length > 0
        ? (existingCategories[0].sort_order || 0) + 1
        : 1;

      const newCategory = {
        name,
        slug,
        color: color || defaultColor,
        sort_order: nextSortOrder,
      };

      const { data, error } = await supabase
        .from(tableName)
        .insert([newCategory])
        .select()
        .single();

      if (error) {
        console.error(`Error creating ${entityName} category:`, error);
        if (error.code === '23505') {
          return NextResponse.json({ error: "Category already exists" }, { status: 400 });
        }
        throw error;
      }

      return NextResponse.json(data, { status: 201 });
    } catch (error) {
      console.error(`Error creating ${entityName} category:`, error);
      return NextResponse.json({ error: `Failed to create ${entityName} category` }, { status: 500 });
    }
  }

  return { GET, POST };
}

export function createCategoryIdHandlers(config: CategoryConfig) {
  const { tableName, entityName } = config;

  async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const body = await request.json();
      const { name, color } = body;

      if (!name || typeof name !== "string") {
        return NextResponse.json({ error: "Invalid category name" }, { status: 400 });
      }

      const supabase = getSupabaseAdmin();
      const slug = generateSlug(name);

      const updateData: Record<string, string> = { name, slug };
      if (color) {
        updateData.color = color;
      }

      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', params.id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating ${entityName} category:`, error);
        throw error;
      }

      if (!data) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }

      return NextResponse.json(data);
    } catch (error) {
      console.error(`Error updating ${entityName} category:`, error);
      return NextResponse.json({ error: `Failed to update ${entityName} category` }, { status: 500 });
    }
  }

  async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const supabase = getSupabaseAdmin();

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', params.id);

      if (error) {
        console.error(`Error deleting ${entityName} category:`, error);
        throw error;
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error(`Error deleting ${entityName} category:`, error);
      return NextResponse.json({ error: `Failed to delete ${entityName} category` }, { status: 500 });
    }
  }

  return { PUT, DELETE };
}
