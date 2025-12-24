import { NextResponse } from 'next/server';
import { getPortfolios, createPortfolio } from '@/lib/supabase-data';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

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

    // タイトルは必須
    if (!body.title) {
      return NextResponse.json(
        { message: 'タイトルは必須です' },
        { status: 400 }
      );
    }

    // 投稿形態に応じたバリデーション
    const displayType = body.display_type || 'youtube';
    
    if (displayType === 'youtube') {
      // YouTube動画の場合、youtube_urlが必須
      if (!body.youtube_url) {
        return NextResponse.json(
          { message: 'YouTube URLは必須です' },
          { status: 400 }
        );
      }
    } else if (displayType === 'gallery') {
      // 画像ギャラリーの場合、imagesが必須（少なくとも1枚）
      if (!body.images || !Array.isArray(body.images) || body.images.length === 0) {
        return NextResponse.json(
          { message: '画像を1枚以上アップロードしてください' },
          { status: 400 }
        );
      }
    }

    // 既存のポートフォリオのsort_orderを全て+1して、新規を先頭に配置
    const supabase = getSupabaseAdmin();
    const { data: existingPortfolios } = await supabase
      .from('portfolios')
      .select('id, sort_order');

    if (existingPortfolios && existingPortfolios.length > 0) {
      for (const item of existingPortfolios) {
        await supabase
          .from('portfolios')
          .update({ sort_order: (item.sort_order ?? 0) + 1 })
          .eq('id', item.id);
      }
    }

    // データベースに保存するデータを準備
    const portfolioData: any = {
      title: body.title,
      description: body.description || null,
      sort_order: 0,  // 新規ポートフォリオは先頭に配置
      published: body.published ?? true,
      display_type: displayType,
      reference_url: body.reference_url || null,
      image_display_mode: body.image_display_mode || 'cover',
    };

    // display_typeに応じてフィールドを設定
    if (displayType === 'youtube') {
      portfolioData.youtube_url = body.youtube_url;
      portfolioData.images = null;
    } else if (displayType === 'gallery') {
      portfolioData.youtube_url = null;
      portfolioData.images = body.images || [];
    }

    const portfolio = await createPortfolio(portfolioData);

    // カテゴリの関連付け（category_idが指定されている場合）
    if (body.category_id && portfolio.id) {
      const supabase = getSupabaseAdmin();
      const { error: relationError } = await supabase
        .from('portfolio_category_relations')
        .insert({
          portfolio_id: portfolio.id,
          category_id: body.category_id,
        });

      if (relationError) {
        console.error('Error creating portfolio category relation:', relationError);
        // カテゴリ関連付けのエラーは警告として記録するが、ポートフォリオ作成は成功とする
      }
    }

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error: any) {
    console.error('Error creating portfolio:', error);
    const errorMessage = error?.message || 'ポートフォリオの作成に失敗しました';
    return NextResponse.json(
      { message: errorMessage, error: error?.details || error },
      { status: 500 }
    );
  }
}
