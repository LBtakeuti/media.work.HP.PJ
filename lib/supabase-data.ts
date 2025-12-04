import { getSupabaseAdmin } from './supabase-admin';
import { unstable_noStore as noStore } from 'next/cache';

// サーバーサイドでのデータ取得にはサービスロールキーを使用
// （RLSをバイパスして全てのデータにアクセス可能）
const getSupabase = () => getSupabaseAdmin();

// ============================================
// インターフェース定義
// ============================================

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  excerpt?: string;
  summary?: string;
  slug?: string;
  published?: boolean;
  published_at?: string;
  image_display_mode?: 'contain' | 'cover';
  categories?: string[]; // カテゴリ名の配列
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  status?: string;
  created_at?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  content: string;
  summary?: string;
  image?: string;
  icon?: string;
  slug?: string;
  featured?: boolean;
  sort_order?: number;
  published?: boolean;
  published_at?: string;
  image_display_mode?: 'contain' | 'cover';
  categories?: string[]; // カテゴリ名の配列
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  color?: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

// ============================================
// ニュースカテゴリ関連
// ============================================

export async function getNewsCategories(): Promise<Category[]> {
  noStore(); // キャッシュを無効化
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('news_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching news categories:', error);
    throw error;
  }

  return data || [];
}

export async function createNewsCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('news_categories')
    .insert([category])
    .select()
    .single();

  if (error) {
    console.error('Error creating news category:', error);
    throw error;
  }

  return data;
}

export async function updateNewsCategory(id: string, category: Partial<Category>): Promise<Category> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('news_categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating news category:', error);
    throw error;
  }

  return data;
}

export async function deleteNewsCategory(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('news_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting news category:', error);
    throw error;
  }
}

// ============================================
// サービスカテゴリ関連
// ============================================

export async function getServiceCategories(): Promise<Category[]> {
  noStore(); // キャッシュを無効化
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching service categories:', error);
    throw error;
  }

  return data || [];
}

export async function createServiceCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('service_categories')
    .insert([category])
    .select()
    .single();

  if (error) {
    console.error('Error creating service category:', error);
    throw error;
  }

  return data;
}

export async function updateServiceCategory(id: string, category: Partial<Category>): Promise<Category> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('service_categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service category:', error);
    throw error;
  }

  return data;
}

export async function deleteServiceCategory(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('service_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service category:', error);
    throw error;
  }
}

// ============================================
// ニュース関連（最適化済み - JOINクエリ使用）
// ============================================

export async function getNews(): Promise<NewsItem[]> {
  noStore(); // キャッシュを無効化
  const supabase = getSupabase();

  // JOINクエリで一度に全データを取得（N+1問題を解消）
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      news_category_relations (
        news_categories (
          name
        )
      )
    `)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching news:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`Failed to fetch news: ${error.message} (code: ${error.code})`);
  }

  // カテゴリ名を配列に変換
  const newsWithCategories = (data || []).map(item => {
    const categories = item.news_category_relations
      ?.map((rel: any) => rel.news_categories?.name)
      .filter(Boolean) || [];

    const { news_category_relations, ...newsItem } = item;
    return {
      ...newsItem,
      categories
    };
  });

  return newsWithCategories;
}

export async function getNewsByCategory(categorySlug: string): Promise<NewsItem[]> {
  const supabase = getSupabase();
  
  // カテゴリIDを取得
  const { data: category } = await supabase
    .from('news_categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (!category) {
    return [];
  }

  // そのカテゴリに紐づくニュースIDを取得
  const { data: relations } = await supabase
    .from('news_category_relations')
    .select('news_id')
    .eq('category_id', category.id);

  if (!relations || relations.length === 0) {
    return [];
  }

  const newsIds = relations.map(r => r.news_id);
  
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .in('id', newsIds)
    .eq('published', true)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching news by category:', error);
    throw error;
  }

  return data || [];
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const supabase = getSupabase();
  
  // JOINクエリで一度に取得
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      news_category_relations (
        news_categories (
          name
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching news by id:', error);
    return null;
  }

  const categories = data.news_category_relations
    ?.map((rel: any) => rel.news_categories?.name)
    .filter(Boolean) || [];
  
  const { news_category_relations, ...newsItem } = data;
  return { ...newsItem, categories };
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const supabase = getSupabase();
  
  // JOINクエリで一度に取得
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      news_category_relations (
        news_categories (
          name
        )
      )
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching news by slug:', error);
    return null;
  }

  const categories = data.news_category_relations
    ?.map((rel: any) => rel.news_categories?.name)
    .filter(Boolean) || [];
  
  const { news_category_relations, ...newsItem } = data;
  return { ...newsItem, categories };
}

export async function createNews(news: Omit<NewsItem, 'id'>): Promise<NewsItem> {
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

  // Prepare data for database (remove categories as it's managed via relations)
  const { categories, ...dbNews } = news;
  
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

  // カテゴリの紐付けを一括作成
  if (newNews && categories && categories.length > 0) {
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

  return { ...newNews, categories: categories || [] };
}

export async function updateNews(id: string, news: Partial<NewsItem>): Promise<NewsItem> {
  const supabase = getSupabase();
  const { categories, ...dbNews } = news;
  
  const { data: updatedNews, error } = await supabase
    .from('news')
    .update(dbNews)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating news:', error);
    throw error;
  }

  // カテゴリが提供された場合、紐付けを更新
  if (categories !== undefined) {
    // 既存の紐付けを削除
    await supabase
      .from('news_category_relations')
      .delete()
      .eq('news_id', id);

    // 新しい紐付けを一括作成
    if (categories && categories.length > 0) {
      const { data: categoryData } = await supabase
        .from('news_categories')
        .select('id, name')
        .in('name', categories);

      if (categoryData && categoryData.length > 0) {
        const relations = categoryData.map(cat => ({
          news_id: id,
          category_id: cat.id
        }));

        await supabase
          .from('news_category_relations')
          .insert(relations);
      }
    }
  }

  return { ...updatedNews, categories: categories || [] };
}

export async function deleteNews(id: string): Promise<void> {
  const supabase = getSupabase();
  // カテゴリ紐付けは CASCADE で自動削除される
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
}

// ============================================
// サービス関連（最適化済み - JOINクエリ使用）
// ============================================

export async function getServices(): Promise<ServiceItem[]> {
  noStore(); // キャッシュを無効化
  const supabase = getSupabase();

  // JOINクエリで一度に全データを取得（N+1問題を解消）
  const { data, error } = await supabase
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
    console.error('Error fetching services:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`Failed to fetch services: ${error.message} (code: ${error.code})`);
  }

  // カテゴリ名を配列に変換
  const servicesWithCategories = (data || []).map(item => {
    const categories = item.service_category_relations
      ?.map((rel: any) => rel.service_categories?.name)
      .filter(Boolean) || [];

    const { service_category_relations, ...serviceItem } = item;
    return {
      ...serviceItem,
      categories
    };
  });

  return servicesWithCategories;
}

export async function getServicesByCategory(categorySlug: string): Promise<ServiceItem[]> {
  const supabase = getSupabase();
  
  // カテゴリIDを取得
  const { data: category } = await supabase
    .from('service_categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (!category) {
    return [];
  }

  // そのカテゴリに紐づくサービスIDを取得
  const { data: relations } = await supabase
    .from('service_category_relations')
    .select('service_id')
    .eq('category_id', category.id);

  if (!relations || relations.length === 0) {
    return [];
  }

  const serviceIds = relations.map(r => r.service_id);
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .in('id', serviceIds)
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching services by category:', error);
    throw error;
  }

  return data || [];
}

export async function getServiceById(id: string): Promise<ServiceItem | null> {
  const supabase = getSupabase();
  
  // JOINクエリで一度に取得
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      service_category_relations (
        service_categories (
          name
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching service by id:', error);
    return null;
  }

  const categories = data.service_category_relations
    ?.map((rel: any) => rel.service_categories?.name)
    .filter(Boolean) || [];
  
  const { service_category_relations, ...serviceItem } = data;
  return { ...serviceItem, categories };
}

export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  noStore(); // キャッシュを無効化
  const supabase = getSupabase();

  // まずslugで検索
  let { data, error } = await supabase
    .from('services')
    .select(`
      *,
      service_category_relations (
        service_categories (
          name
        )
      )
    `)
    .eq('slug', slug)
    .single();

  // slugで見つからない場合はIDで検索
  if (error || !data) {
    const result = await supabase
      .from('services')
      .select(`
        *,
        service_category_relations (
          service_categories (
            name
          )
        )
      `)
      .eq('id', slug)
      .single();

    data = result.data;
    error = result.error;
  }

  if (error || !data) {
    console.error('Error fetching service by slug or id:', error);
    return null;
  }

  const categories = data.service_category_relations
    ?.map((rel: any) => rel.service_categories?.name)
    .filter(Boolean) || [];
  
  const { service_category_relations, ...serviceItem } = data;
  return { ...serviceItem, categories };
}

export async function createService(service: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
  const supabase = getSupabase();
  
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

  // Prepare data for database (remove categories as it's managed via relations)
  const { categories, ...dbService } = service;

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

  // カテゴリの紐付けを一括作成
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

  return { ...newService, categories: categories || [] };
}

export async function updateService(id: string, service: Partial<ServiceItem>): Promise<ServiceItem> {
  const supabase = getSupabase();
  const { categories, ...dbService } = service;

  const { data: updatedService, error } = await supabase
    .from('services')
    .update(dbService)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    throw error;
  }

  // カテゴリが提供された場合、紐付けを更新
  if (categories !== undefined) {
    // 既存の紐付けを削除
    await supabase
      .from('service_category_relations')
      .delete()
      .eq('service_id', id);

    // 新しい紐付けを一括作成
    if (categories && categories.length > 0) {
      const { data: categoryData } = await supabase
        .from('service_categories')
        .select('id, name')
        .in('name', categories);

      if (categoryData && categoryData.length > 0) {
        const relations = categoryData.map(cat => ({
          service_id: id,
          category_id: cat.id
        }));

        await supabase
          .from('service_category_relations')
          .insert(relations);
      }
    }
  }

  return { ...updatedService, categories: categories || [] };
}

export async function deleteService(id: string): Promise<void> {
  const supabase = getSupabase();
  // カテゴリ紐付けは CASCADE で自動削除される
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}

// ============================================
// お問い合わせ関連
// ============================================

export async function getContacts(): Promise<ContactSubmission[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }

  return data || [];
}

export async function saveContact(contact: Omit<ContactSubmission, 'id' | 'created_at'>): Promise<ContactSubmission> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select()
    .single();

  if (error) {
    console.error('Error saving contact:', error);
    throw error;
  }

  return data;
}

export async function updateContactStatus(id: string, status: string): Promise<ContactSubmission> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('contacts')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating contact status:', error);
    throw error;
  }

  return data;
}

export async function deleteContact(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
}

// ============================================
// ポートフォリオ関連
// ============================================

export interface PortfolioCategory {
  id: string;
  name: string;
  slug?: string;
  color?: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  youtube_url?: string;
  sort_order?: number;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
  display_type?: 'youtube' | 'gallery';
  category_id?: string;
  category?: PortfolioCategory;
  images?: string[];
  reference_url?: string;
  image_display_mode?: 'contain' | 'cover';
}

export async function getPortfolios(): Promise<PortfolioItem[]> {
  noStore();
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('portfolios')
    .select(`
      *,
      portfolio_category_relations (
        category:portfolio_categories (*)
      )
    `)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching portfolios:', error);
    throw error;
  }

  // リレーションからカテゴリを抽出して整形
  const portfolios = (data || []).map((item: any) => {
    const relation = item.portfolio_category_relations?.[0];
    const category = relation?.category || null;
    // portfolio_category_relations を除外して、category を追加
    const { portfolio_category_relations, ...rest } = item;
    return {
      ...rest,
      category,
      category_id: category?.id || null,
    };
  });

  return portfolios;
}

export async function getPublishedPortfolios(): Promise<PortfolioItem[]> {
  noStore();
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('portfolios')
    .select(`
      *,
      portfolio_category_relations (
        category:portfolio_categories (*)
      )
    `)
    .eq('published', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching published portfolios:', error);
    throw error;
  }

  // リレーションからカテゴリを抽出して整形
  const portfolios = (data || []).map((item: any) => {
    const relation = item.portfolio_category_relations?.[0];
    const category = relation?.category || null;
    const { portfolio_category_relations, ...rest } = item;
    return {
      ...rest,
      category,
      category_id: category?.id || null,
    };
  });

  return portfolios;
}

export async function getPortfolioById(id: string): Promise<PortfolioItem | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('portfolios')
    .select(`
      *,
      portfolio_category_relations (
        category:portfolio_categories (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching portfolio by id:', error);
    return null;
  }

  // リレーションからカテゴリを抽出して整形
  const relation = (data as any)?.portfolio_category_relations?.[0];
  const category = relation?.category || null;
  const { portfolio_category_relations, ...rest } = data as any;

  return {
    ...rest,
    category,
    category_id: category?.id || null,
  };
}

export async function createPortfolio(portfolio: Omit<PortfolioItem, 'id' | 'created_at' | 'updated_at'>): Promise<PortfolioItem> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('portfolios')
    .insert([portfolio])
    .select()
    .single();

  if (error) {
    console.error('Error creating portfolio:', error);
    throw error;
  }

  return data;
}

export async function updatePortfolio(id: string, portfolio: Partial<PortfolioItem>): Promise<PortfolioItem> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('portfolios')
    .update(portfolio)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating portfolio:', error);
    throw error;
  }

  return data;
}

export async function deletePortfolio(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('portfolios')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting portfolio:', error);
    throw error;
  }
}

export async function getPortfolioCategories(): Promise<PortfolioCategory[]> {
  noStore();
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('portfolio_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching portfolio categories:', error);
    return [];
  }

  return data || [];
}

export async function getPortfolioCategoryById(id: string): Promise<PortfolioCategory | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('portfolio_categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching portfolio category by id:', error);
    return null;
  }

  return data;
}

export async function createPortfolioCategory(category: Omit<PortfolioCategory, 'id' | 'created_at' | 'updated_at'>): Promise<PortfolioCategory> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('portfolio_categories')
    .insert([category])
    .select()
    .single();

  if (error) {
    console.error('Error creating portfolio category:', error);
    throw error;
  }

  return data;
}

export async function updatePortfolioCategory(id: string, category: Partial<PortfolioCategory>): Promise<PortfolioCategory> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('portfolio_categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating portfolio category:', error);
    throw error;
  }

  return data;
}

export async function deletePortfolioCategory(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('portfolio_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting portfolio category:', error);
    throw error;
  }
}
