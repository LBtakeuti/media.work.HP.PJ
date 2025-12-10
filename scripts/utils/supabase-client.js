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

module.exports = { supabase, supabaseUrl, supabaseServiceKey };
