const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  // Supabaseのダイレクト接続を使用
  // パスワードは Supabase Dashboard > Project Settings > Database > Database password で確認
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;

  if (!dbPassword) {
    console.error('❌ SUPABASE_DB_PASSWORDが設定されていません');
    console.log('💡 Supabase Dashboard > Settings > Database でパスワードを確認してください');
    console.log('💡 または、以下のコマンドで環境変数を設定してください:');
    console.log('   export SUPABASE_DB_PASSWORD="your-password"');
    console.log('   node scripts/run-migration-pg.js');
    process.exit(1);
  }

  const connectionString = `postgresql://postgres.qazyoxligvjsasfqettg:${dbPassword}@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`;

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔄 データベースに接続しています...');
    await client.connect();
    console.log('✅ 接続成功');

    // マイグレーションファイルを読み込む
    const migrationPath = path.join(__dirname, '../supabase/migrations/009_create_category_system.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 マイグレーションファイルを読み込みました');
    console.log('🔄 マイグレーションを実行中...');

    // SQLを実行
    await client.query(sql);

    console.log('✅ マイグレーションが正常に完了しました！');

    // テーブルが作成されたか確認
    const checkTables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('news_categories', 'service_categories', 'news_category_relations', 'service_category_relations')
      ORDER BY table_name;
    `);

    console.log('\n作成されたテーブル:');
    checkTables.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    if (error.detail) console.error('詳細:', error.detail);
    if (error.hint) console.error('ヒント:', error.hint);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n接続を閉じました');
  }
}

runMigration();
