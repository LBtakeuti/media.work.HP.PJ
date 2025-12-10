const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Supabaseクライアントを初期化（サービスロールキー使用）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 環境変数が設定されていません');
  console.error('   NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を .env.local に設定してください');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🔄 マイグレーションを開始します...');

    // マイグレーションファイルを読み込む
    const migrationPath = path.join(__dirname, '../supabase/migrations/009_create_category_system.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 マイグレーションファイルを読み込みました');

    // SQLを実行（Supabase JavaScript クライアントではRPCを使う必要がある）
    // PostgRESTでは直接SQLを実行できないため、pg-promise または Management API を使用

    // 代わりに、各テーブルをチェックして必要に応じて作成する
    console.log('⚠️  Supabase JavaScript クライアントでは直接SQLを実行できません');
    console.log('💡 代わりに、以下の方法でマイグレーションを実行してください:');
    console.log('');
    console.log('1. Supabase Dashboard (https://supabase.com/dashboard) にアクセス');
    console.log('2. プロジェクト qazyoxligvjsasfqettg を選択');
    console.log('3. SQL Editor を開く');
    console.log('4. 以下のファイルの内容をコピー&ペースト:');
    console.log('   supabase/migrations/009_create_category_system.sql');
    console.log('');
    console.log('または、PostgreSQL CLIを使用:');
    console.log('psql -h qazyoxligvjsasfqettg.supabase.co -U postgres -d postgres < supabase/migrations/009_create_category_system.sql');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

runMigration();
