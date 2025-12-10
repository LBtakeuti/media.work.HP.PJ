require('dotenv').config({ path: '.env.local' });

/**
 * 必要な環境変数が設定されているか確認する
 * @param {string[]} requiredVars - 必要な環境変数名の配列
 * @returns {Object} 環境変数の値を含むオブジェクト
 */
function requireEnvVars(requiredVars) {
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ 環境変数が設定されていません');
    console.error(`   ${missingVars.join(', ')} を .env.local に設定してください`);
    process.exit(1);
  }

  const result = {};
  requiredVars.forEach(varName => {
    result[varName] = process.env[varName];
  });

  return result;
}

module.exports = { requireEnvVars };
