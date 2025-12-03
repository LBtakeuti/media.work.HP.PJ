const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabaseクライアントを初期化（サービスロールキー使用）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qazyoxligvjsasfqettg.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhenlveGxpZ3Zqc2FzZnFldHRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzYzMDM4OSwiZXhwIjoyMDc5MjA2Mzg5fQ.pnhr7w53SyH9HNQEKJ8myCd8Qi9nHCjHQnXYoLEbVmc';

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
