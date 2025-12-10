const { supabase } = require('./utils/supabase-client');

async function checkContacts() {
  console.log('🔍 お問い合わせデータを確認しています...\n');

  // contactsテーブルの存在確認
  try {
    const { data, error, count } = await supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('❌ エラー:', error.message);
      console.error('詳細:', error);
      return;
    }

    console.log(`✅ contactsテーブル: 存在します (レコード数: ${count || 0})\n`);

    if (data && data.length > 0) {
      console.log('📋 最新のお問い合わせ（最大5件）:\n');
      data.forEach((contact, index) => {
        console.log(`${index + 1}. ID: ${contact.id}`);
        console.log(`   名前: ${contact.name}`);
        console.log(`   メール: ${contact.email}`);
        console.log(`   件名: ${contact.subject || '(なし)'}`);
        console.log(`   ステータス: ${contact.status || '(なし)'}`);
        console.log(`   日時: ${contact.created_at}`);
        console.log(`   カラム: ${Object.keys(contact).join(', ')}`);
        console.log('');
      });
    } else {
      console.log('📭 お問い合わせはまだありません');
    }

    // テーブル構造を確認
    console.log('\n🔍 テーブル構造を確認...\n');
    const { data: tableInfo } = await supabase
      .from('contacts')
      .select('*')
      .limit(1);

    if (tableInfo && tableInfo.length > 0) {
      console.log('📊 カラム一覧:');
      Object.keys(tableInfo[0]).forEach(col => {
        console.log(`  - ${col}`);
      });
    }

  } catch (err) {
    console.error('❌ エラーが発生しました:', err.message);
  }
}

checkContacts();
