import { NextResponse } from 'next/server';
import { getPortfolios, createPortfolio } from '@/lib/supabase-data';

export async function GET() {
  try {
    const portfolios = await getPortfolios();
    return NextResponse.json(portfolios);
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return NextResponse.json(
      { message: 'ポートフォリオの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.youtube_url) {
      return NextResponse.json(
        { message: 'タイトルとYouTube URLは必須です' },
        { status: 400 }
      );
    }

    const portfolio = await createPortfolio({
      title: body.title,
      description: body.description || '',
      youtube_url: body.youtube_url,
      sort_order: body.sort_order || 0,
      published: body.published ?? true,
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { message: 'ポートフォリオの作成に失敗しました' },
      { status: 500 }
    );
  }
}
