const https = require('https');
const fs = require('fs');
const path = require('path');
const { requireEnvVars } = require('./utils/env-loader');

const { SUPABASE_ACCESS_TOKEN, SUPABASE_PROJECT_REF } = requireEnvVars([
  'SUPABASE_ACCESS_TOKEN',
  'SUPABASE_PROJECT_REF'
]);

async function runMigration() {
  try {
    console.log('🔄 マイグレーションを開始します...');

    // マイグレーションファイルを読み込む
    const migrationPath = path.join(__dirname, '../supabase/migrations/009_create_category_system.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('📄 マイグレーションファイルを読み込みました');

    // Supabase Management API を使用してSQLを実行
    const postData = JSON.stringify({
      query: sql
    });

    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: `/v1/projects/${SUPABASE_PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('🔄 Supabase Management API経由でSQLを実行中...');

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ マイグレーションが正常に完了しました！');
          console.log('レスポンス:', data);
        } else {
          console.error(`❌ エラーが発生しました (Status: ${res.statusCode})`);
          console.error('レスポンス:', data);
          process.exit(1);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ リクエストエラー:', error.message);
      process.exit(1);
    });

    req.write(postData);
    req.end();

  } catch (error) {
    console.error('❌ エラーが発生しました:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

runMigration();
