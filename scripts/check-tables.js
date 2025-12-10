const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 環境変数が設定されていません');
  console.error('   NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を .env.local に設定してください');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  console.log('🔍 テーブルを確認しています...\n');

  const tables = [
    'news_categories',
    'service_categories',
    'news_category_relations',
    'service_category_relations'
  ];

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${table}: エラー - ${error.message}`);
      } else {
        console.log(`✅ ${table}: 存在します (レコード数: ${count || 0})`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }

  console.log('\n🔍 既存のテーブル構造を確認...\n');

  // newsテーブルの構造確認
  try {
    const { data: newsData } = await supabase
      .from('news')
      .select('*')
      .limit(1);

    if (newsData && newsData.length > 0) {
      console.log('✅ newsテーブルのカラム:', Object.keys(newsData[0]).join(', '));
    }
  } catch (err) {
    console.log('❌ newsテーブル確認エラー:', err.message);
  }

  // servicesテーブルの構造確認
  try {
    const { data: servicesData } = await supabase
      .from('services')
      .select('*')
      .limit(1);

    if (servicesData && servicesData.length > 0) {
      console.log('✅ servicesテーブルのカラム:', Object.keys(servicesData[0]).join(', '));
    }
  } catch (err) {
    console.log('❌ servicesテーブル確認エラー:', err.message);
  }
}

checkTables();
