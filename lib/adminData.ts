// フロント専用のデータ管理（LocalStorage使用）

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

// タグの取得
export function getTags(): Tag[] {
  if (typeof window === 'undefined') return [];
  const tagsJson = localStorage.getItem('admin_tags');
  if (!tagsJson) {
    // 初期データ
    const defaultTags: Tag[] = [
      { id: '1', name: 'サービス', createdAt: new Date().toISOString() },
      { id: '2', name: '新規', createdAt: new Date().toISOString() },
      { id: '3', name: 'ホームページ', createdAt: new Date().toISOString() },
      { id: '4', name: 'リニューアル', createdAt: new Date().toISOString() },
      { id: '5', name: '採用', createdAt: new Date().toISOString() },
      { id: '6', name: '人材', createdAt: new Date().toISOString() },
    ];
    saveTags(defaultTags);
    return defaultTags;
  }
  return JSON.parse(tagsJson);
}

// タグの保存
export function saveTags(tags: Tag[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_tags', JSON.stringify(tags));
}

// タグの作成
export function createTag(name: string): Tag {
  const tags = getTags();
  const newTag: Tag = {
    id: Date.now().toString(),
    name,
    createdAt: new Date().toISOString(),
  };
  tags.push(newTag);
  saveTags(tags);
  return newTag;
}

// タグの更新
export function updateTag(id: string, name: string): boolean {
  const tags = getTags();
  const index = tags.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tags[index].name = name;
  saveTags(tags);
  return true;
}

// タグの削除
export function deleteTag(id: string): boolean {
  const tags = getTags();
  const filteredTags = tags.filter((t) => t.id !== id);
  if (filteredTags.length === tags.length) return false;
  saveTags(filteredTags);
  return true;
}

// ニュース記事の管理用データ型
export interface AdminNewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  image?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// ニュース記事の取得
export function getAdminNews(): AdminNewsItem[] {
  if (typeof window === 'undefined') return [];
  const newsJson = localStorage.getItem('admin_news');
  if (!newsJson) return [];
  return JSON.parse(newsJson);
}

// ニュース記事の保存
export function saveAdminNews(news: AdminNewsItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_news', JSON.stringify(news));
}

// ニュース記事の作成
export function createAdminNews(data: Omit<AdminNewsItem, 'id' | 'createdAt' | 'updatedAt'>): AdminNewsItem {
  const news = getAdminNews();
  const newItem: AdminNewsItem = {
    ...data,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  news.unshift(newItem);
  saveAdminNews(news);
  return newItem;
}

// ニュース記事の更新
export function updateAdminNews(id: string, data: Partial<AdminNewsItem>): boolean {
  const news = getAdminNews();
  const index = news.findIndex((n) => n.id === id);
  if (index === -1) return false;
  news[index] = {
    ...news[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  saveAdminNews(news);
  return true;
}

// ニュース記事の削除
export function deleteAdminNews(id: string): boolean {
  const news = getAdminNews();
  const filteredNews = news.filter((n) => n.id !== id);
  if (filteredNews.length === news.length) return false;
  saveAdminNews(filteredNews);
  return true;
}

// ニュース記事を公開データと同期
export function syncNewsToPublic(): void {
  const adminNews = getAdminNews();
  // data.tsのgetNews()で使用される形式に変換
  const publicNews = adminNews.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    excerpt: item.summary,
    date: item.date,
    category: item.category,
    image: item.image,
    summary: item.summary,
    tags: item.tags,
  }));
  // 注: 実際には、ここでAPIを叩いてサーバーに保存する
  // フロントのみの実装なので、LocalStorageに保存
  localStorage.setItem('public_news', JSON.stringify(publicNews));
}

