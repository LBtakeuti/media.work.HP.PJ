const fs = require('fs');
const path = require('path');
// supabaseクライアントは現在未使用だが、将来の拡張のためにインポートを残す
// const { supabase } = require('./utils/supabase-client');

async function runMigration() {
  try {
    console.log('🔄 マイグレーションを開始します...');

    // マイグレーションファイルを読み込む
    const migrationPath = path.join(__dirname, '../supabase/migrations/009_create_category_system.sql');
    fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 マイグレーションファイルを読み込みました');

    // SQLを実行（Supabase JavaScript クライアントではRPCを使う必要がある）
    // PostgRESTでは直接SQLを実行できないため、pg-promise または Management API を使用

    // 代わりに、各テーブルをチェックして必要に応じて作成する
    console.log('⚠️  Supabase JavaScript クライアントでは直接SQLを実行できません');
    console.log('💡 代わりに、以下の方法でマイグレーションを実行してください:');
    console.log('');
    console.log('1. Supabase Dashboard (https://supabase.com/dashboard) にアクセス');
    console.log('2. プロジェクトを選択');
    console.log('3. SQL Editor を開く');
    console.log('4. 以下のファイルの内容をコピー&ペースト:');
    console.log('   supabase/migrations/009_create_category_system.sql');
    console.log('');
    console.log('または、PostgreSQL CLIを使用:');
    console.log('psql -h <project-ref>.supabase.co -U postgres -d postgres < supabase/migrations/009_create_category_system.sql');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

runMigration();
