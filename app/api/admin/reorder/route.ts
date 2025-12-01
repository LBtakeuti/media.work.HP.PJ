import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// 表示順を一括更新
export async function POST(request: Request) {
  try {
    const { table, items } = await request.json();

    // 許可されたテーブルのみ
    const allowedTables = ['news', 'services', 'portfolios'];
    if (!allowedTables.includes(table)) {
      return NextResponse.json(
        { message: '無効なテーブルです' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { message: 'アイテムリストが必要です' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // テーブルの存在確認とカラムの確認
    console.log(`Updating sort_order for ${items.length} items in table: ${table}`);

    // 各アイテムの表示順を更新
    for (const item of items) {
      if (!item.id) {
        console.error(`Invalid item: missing id`, item);
        return NextResponse.json(
          { message: '無効なアイテムIDです' },
          { status: 400 }
        );
      }

      if (typeof item.sort_order !== 'number') {
        console.error(`Invalid sort_order for item ${item.id}:`, item.sort_order);
        return NextResponse.json(
          { message: `無効な表示順です: ${item.sort_order}` },
          { status: 400 }
        );
      }

      console.log(`Updating ${table} id=${item.id}, sort_order=${item.sort_order}`);

      const { data, error } = await supabase
        .from(table)
        .update({ sort_order: item.sort_order })
        .eq('id', item.id)
        .select();

      if (error) {
        console.error(`Error updating ${table} sort order for item ${item.id}:`, error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('Item being updated:', JSON.stringify(item, null, 2));
        return NextResponse.json(
          { 
            message: `表示順の更新に失敗しました: ${error.message || 'Unknown error'}`,
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
              hint: error.hint,
            },
            table: table,
            item: item
          },
          { status: 500 }
        );
      }

      if (!data || data.length === 0) {
        console.warn(`No rows updated for ${table} id=${item.id}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error reordering items:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { 
        message: '表示順の更新に失敗しました',
        error: error?.message || String(error),
        details: error
      },
      { status: 500 }
    );
  }
}
