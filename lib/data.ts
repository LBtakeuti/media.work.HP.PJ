import { promises as fs } from 'fs';
import path from 'path';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  image?: string;
  excerpt?: string;
  summary?: string;
  tags?: string[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const dataDir = path.join(process.cwd(), 'data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// News data
const newsFilePath = path.join(dataDir, 'news.json');

export async function getNews(): Promise<NewsItem[]> {
  await ensureDataDir();
  try {
    const fileContents = await fs.readFile(newsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch {
    // Return default data if file doesn't exist
    return [
      {
        id: '1',
        title: '新サービス開始のお知らせ',
        content: '<p>この度、新サービスを開始いたしました。</p><p>詳細については、お問い合わせください。</p>',
        excerpt: 'この度、新サービスを開始いたしました。詳細については、お問い合わせください。',
        date: '2024-01-15',
        category: 'お知らせ',
        image: '/sevilla-tower-g8a5d080a4_640.jpg',
        summary: 'お客様により良いサービスを提供するため、新しいサービスを開始いたしました。',
        tags: ['サービス', '新規'],
      },
      {
        id: '2',
        title: 'ホームページをリニューアルしました',
        content: '<p>ホームページをリニューアルし、より使いやすく、見やすくなりました。</p><p>今後ともよろしくお願いいたします。</p>',
        excerpt: 'ホームページをリニューアルし、より使いやすく、見やすくなりました。',
        date: '2024-01-10',
        category: 'お知らせ',
        image: '/guizhou-g1b8481b2f_640.jpg',
        summary: 'ユーザビリティを向上させ、最新のデザインを採用したホームページにリニューアルしました。',
        tags: ['ホームページ', 'リニューアル'],
      },
      {
        id: '3',
        title: '採用情報を更新しました',
        content: '<p>新卒採用・中途採用の情報を更新いたしました。</p><p>詳細は採用ページをご覧ください。</p>',
        excerpt: '新卒採用・中途採用の情報を更新いたしました。',
        date: '2024-01-05',
        category: '採用',
        image: '/dusseldorf-4609388_1280.jpg',
        summary: '2024年度の新卒採用および中途採用の募集要項を更新いたしました。',
        tags: ['採用', '人材'],
      },
      {
        id: '4',
        title: '年末年始の営業のお知らせ',
        content: '<p>年末年始の営業日程をお知らせいたします。</p><p>12月29日から1月3日まで休業とさせていただきます。</p>',
        excerpt: '年末年始の営業日程をお知らせいたします。',
        date: '2023-12-20',
        category: 'お知らせ',
        image: '/sevilla-tower-g8a5d080a4_640.jpg',
        summary: '年末年始の休業期間についてお知らせいたします。',
        tags: ['営業日', '年末年始'],
      },
      {
        id: '5',
        title: '新オフィス開設のお知らせ',
        content: '<p>この度、東京都内に新オフィスを開設いたしました。</p><p>アクセスの良い立地で、より良いサービスを提供してまいります。</p>',
        excerpt: 'この度、東京都内に新オフィスを開設いたしました。',
        date: '2023-12-15',
        category: 'お知らせ',
        image: '/guizhou-g1b8481b2f_640.jpg',
        summary: 'ビジネスの拡大に伴い、新たなオフィスを開設いたしました。',
        tags: ['オフィス', '開設'],
      },
      {
        id: '6',
        title: 'セミナー開催のご案内',
        content: '<p>来月、業界セミナーを開催いたします。</p><p>最新のトレンドや技術についてご紹介いたします。ぜひご参加ください。</p>',
        excerpt: '来月、業界セミナーを開催いたします。',
        date: '2023-12-10',
        category: 'イベント',
        image: '/dusseldorf-4609388_1280.jpg',
        summary: '業界の最新情報をお届けするセミナーを開催いたします。',
        tags: ['セミナー', 'イベント'],
      },
    ];
  }
}

export async function saveNews(news: NewsItem[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(newsFilePath, JSON.stringify(news, null, 2), 'utf8');
}

// Contact submissions data
const contactFilePath = path.join(dataDir, 'contacts.json');

export async function getContacts(): Promise<ContactSubmission[]> {
  await ensureDataDir();
  try {
    const fileContents = await fs.readFile(contactFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch {
    return [];
  }
}

export async function saveContact(contact: ContactSubmission): Promise<void> {
  await ensureDataDir();
  const contacts = await getContacts();
  contacts.push(contact);
  await fs.writeFile(contactFilePath, JSON.stringify(contacts, null, 2), 'utf8');
}

// Get single news item by ID
export async function getNewsById(id: string): Promise<NewsItem | null> {
  const news = await getNews();
  return news.find((item) => item.id === id) || null;
}

// Service data interface
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  image?: string;
  summary?: string;
  tags?: string[];
}

// Get all services
export async function getServices(): Promise<ServiceItem[]> {
  // Return mock data for now
  return [
    {
      id: '1',
      title: 'サービスタイトル1',
      description: 'サービスの説明文がここに入ります。詳細な説明を記載します。',
      content: '<p>サービスの詳細な説明がここに入ります。</p>',
      category: 'プレスリリース',
      image: '/sevilla-tower-g8a5d080a4_640.jpg',
    },
    {
      id: '2',
      title: 'サービスタイトル2',
      description: 'サービスの説明文がここに入ります。詳細な説明を記載します。',
      content: '<p>サービスの詳細な説明がここに入ります。</p>',
      category: 'プレスリリース',
      image: '/guizhou-g1b8481b2f_640.jpg',
    },
    {
      id: '3',
      title: 'サービスタイトル3',
      description: 'サービスの説明文がここに入ります。詳細な説明を記載します。',
      content: '<p>サービスの詳細な説明がここに入ります。</p>',
      category: 'プレスリリース',
      image: '/dusseldorf-4609388_1280.jpg',
    },
    {
      id: '4',
      title: 'サービスタイトル4',
      description: 'サービスの説明文がここに入ります。詳細な説明を記載します。',
      content: '<p>サービスの詳細な説明がここに入ります。</p>',
      category: 'プレスリリース',
      image: '/sevilla-tower-g8a5d080a4_640.jpg',
    },
    {
      id: '5',
      title: 'サービスタイトル5',
      description: 'サービスの説明文がここに入ります。詳細な説明を記載します。',
      content: '<p>サービスの詳細な説明がここに入ります。</p>',
      category: 'プレスリリース',
      image: '/guizhou-g1b8481b2f_640.jpg',
    },
    {
      id: '6',
      title: 'サービスタイトル6',
      description: 'サービスの説明文がここに入ります。詳細な説明を記載します。',
      content: '<p>サービスの詳細な説明がここに入ります。</p>',
      category: 'プレスリリース',
      image: '/dusseldorf-4609388_1280.jpg',
    },
  ];
}

// Get single service by ID
export async function getServiceById(id: string): Promise<ServiceItem | null> {
  const services = await getServices();
  return services.find((item) => item.id === id) || null;
}


