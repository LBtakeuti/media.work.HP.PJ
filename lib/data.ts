import { promises as fs } from 'fs';
import path from 'path';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
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
        content: 'この度、新サービスを開始いたしました。詳細については、お問い合わせください。',
        date: '2024-01-15',
        category: 'お知らせ',
      },
      {
        id: '2',
        title: 'ホームページをリニューアルしました',
        content: 'ホームページをリニューアルし、より使いやすく、見やすくなりました。',
        date: '2024-01-10',
        category: 'お知らせ',
      },
      {
        id: '3',
        title: '採用情報を更新しました',
        content: '新卒採用・中途採用の情報を更新いたしました。',
        date: '2024-01-05',
        category: '採用',
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


