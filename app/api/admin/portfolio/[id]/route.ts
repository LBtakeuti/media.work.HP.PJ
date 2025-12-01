import { NextResponse } from 'next/server';
import { getPortfolioById, updatePortfolio, deletePortfolio } from '@/lib/supabase-data';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

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

    // データベースに保存するデータを準備
    const portfolioData: any = {
      title: body.title,
      description: body.description || null,
      sort_order: body.sort_order || 0,
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

    const portfolio = await updatePortfolio(params.id, portfolioData);

    // カテゴリの関連付けを更新
    const supabase = getSupabaseAdmin();
    
    // 既存のカテゴリ関連を削除
    await supabase
      .from('portfolio_category_relations')
      .delete()
      .eq('portfolio_id', params.id);

    // 新しいカテゴリ関連を追加（category_idが指定されている場合）
    if (body.category_id) {
      const { error: relationError } = await supabase
        .from('portfolio_category_relations')
        .insert({
          portfolio_id: params.id,
          category_id: body.category_id,
        });

      if (relationError) {
        console.error('Error updating portfolio category relation:', relationError);
        // カテゴリ関連付けのエラーは警告として記録するが、ポートフォリオ更新は成功とする
      }
    }

    return NextResponse.json(portfolio);
  } catch (error: any) {
    console.error('Error updating portfolio:', error);
    const errorMessage = error?.message || 'ポートフォリオの更新に失敗しました';
    return NextResponse.json(
      { message: errorMessage, error: error?.details || error },
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
