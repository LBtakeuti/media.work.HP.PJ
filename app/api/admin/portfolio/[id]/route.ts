import { NextResponse } from 'next/server';
import { getPortfolioById, updatePortfolio, deletePortfolio } from '@/lib/supabase-data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const portfolio = await getPortfolioById(params.id);
    if (!portfolio) {
      return NextResponse.json(
        { message: 'ポートフォリオが見つかりません' },
        { status: 404 }
      );
    }
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { message: 'ポートフォリオの取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    if (!body.title || !body.youtube_url) {
      return NextResponse.json(
        { message: 'タイトルとYouTube URLは必須です' },
        { status: 400 }
      );
    }

    const portfolio = await updatePortfolio(params.id, {
      title: body.title,
      description: body.description || '',
      youtube_url: body.youtube_url,
      sort_order: body.sort_order || 0,
      published: body.published ?? true,
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { message: 'ポートフォリオの更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deletePortfolio(params.id);
    return NextResponse.json({ message: '削除しました' });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return NextResponse.json(
      { message: 'ポートフォリオの削除に失敗しました' },
      { status: 500 }
    );
  }
}
