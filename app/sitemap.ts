import { MetadataRoute } from 'next';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// サイトマップ生成は常に動的に
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://media-work.jp';

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/company`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // 動的ページ: ニュース
  let newsPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = getSupabaseAdmin();
    const { data: news } = await supabase
      .from('news')
      .select('slug, published_at')
      .eq('published', true);

    newsPages = (news || [])
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${siteUrl}/news/${item.slug}`,
        lastModified: item.published_at ? new Date(item.published_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
  } catch (error) {
    console.error('Error fetching news for sitemap:', error);
  }

  // 動的ページ: サービス
  let servicePages: MetadataRoute.Sitemap = [];
  try {
    const supabase = getSupabaseAdmin();
    const { data: services } = await supabase
      .from('services')
      .select('slug, published_at')
      .eq('published', true);

    servicePages = (services || [])
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${siteUrl}/services/${item.slug}`,
        lastModified: item.published_at ? new Date(item.published_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  } catch (error) {
    console.error('Error fetching services for sitemap:', error);
  }

  return [...staticPages, ...newsPages, ...servicePages];
}
