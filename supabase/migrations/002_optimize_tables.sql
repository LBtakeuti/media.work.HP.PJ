-- テーブル最適化マイグレーション

-- 1. タグの冗長なARRAYカラムを削除
ALTER TABLE news DROP COLUMN IF EXISTS tags;
ALTER TABLE services DROP COLUMN IF EXISTS tags;

-- 2. 管理者用のRLSポリシーを追加
-- 管理者による書き込みを許可（サービスロールキー使用）
CREATE POLICY "Allow service role full access on news"
  ON news FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on services"
  ON services FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on tags"
  ON tags FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on news_tags"
  ON news_tags FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on services_tags"
  ON services_tags FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role read access on contacts"
  ON contacts FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role delete on contacts"
  ON contacts FOR DELETE
  USING (auth.role() = 'service_role');

