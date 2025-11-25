import { supabase } from './supabase';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  image?: string;
  excerpt?: string;
  summary?: string;
  slug?: string;
  published?: boolean;
  published_at?: string;
  tags?: string[];
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
  tags?: string[];
}

export interface Tag {
  id: string;
  name: string;
  slug?: string;
  color?: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

// News functions
export async function getNews(): Promise<NewsItem[]> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
    throw error;
  }

  return data || [];
}

export async function getNewsById(id: string): Promise<NewsItem | null> {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching news by id:', error);
    return null;
  }

  return data;
}

export async function createNews(news: Omit<NewsItem, 'id'>): Promise<NewsItem> {
  // Generate slug from title
  const slug = news.title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .substring(0, 100);

  // Prepare data for database (remove tags as it's not in DB schema)
  const { tags, ...dbNews } = news;
  
  const newsData = {
    ...dbNews,
    slug,
    published: true,
    published_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('news')
    .insert([newsData])
    .select()
    .single();

  if (error) {
    console.error('Error creating news:', error);
    throw error;
  }

  return data;
}

export async function updateNews(id: string, news: Partial<NewsItem>): Promise<NewsItem> {
  // Prepare data for database (remove tags as it's not in DB schema)
  const { tags, ...dbNews } = news;
  
  // Generate slug from title if title is being updated
  const updateData = dbNews.title
    ? {
        ...dbNews,
        slug: dbNews.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .substring(0, 100),
      }
    : dbNews;

  const { data, error } = await supabase
    .from('news')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating news:', error);
    throw error;
  }

  return data;
}

export async function deleteNews(id: string): Promise<void> {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
}

// News Tags functions
export async function getNewsTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('news_tags')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching news tags:', error);
    throw error;
  }

  return data || [];
}

export async function createNewsTag(tag: Omit<Tag, 'id' | 'created_at' | 'updated_at'>): Promise<Tag> {
  const { data, error } = await supabase
    .from('news_tags')
    .insert([tag])
    .select()
    .single();

  if (error) {
    console.error('Error creating news tag:', error);
    throw error;
  }

  return data;
}

// Service Tags functions
export async function getServiceTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('service_tags')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching service tags:', error);
    throw error;
  }

  return data || [];
}

export async function createServiceTag(tag: Omit<Tag, 'id' | 'created_at' | 'updated_at'>): Promise<Tag> {
  const { data, error } = await supabase
    .from('service_tags')
    .insert([tag])
    .select()
    .single();

  if (error) {
    console.error('Error creating service tag:', error);
    throw error;
  }

  return data;
}

// Services functions
export async function getServices(): Promise<ServiceItem[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching services:', error);
    throw error;
  }

  return data || [];
}

export async function getServiceById(id: string): Promise<ServiceItem | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching service by id:', error);
    return null;
  }

  return data;
}

export async function createService(service: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select()
    .single();

  if (error) {
    console.error('Error creating service:', error);
    throw error;
  }

  return data;
}

export async function updateService(id: string, service: Partial<ServiceItem>): Promise<ServiceItem> {
  const { data, error } = await supabase
    .from('services')
    .update(service)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    throw error;
  }

  return data;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}

// Contacts functions
export async function getContacts(): Promise<ContactSubmission[]> {
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

