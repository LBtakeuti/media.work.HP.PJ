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

-- 3. タグ情報を含むビューの作成（クエリを簡単にするため）
CREATE VIEW news_with_tags 
WITH (security_invoker = true)
AS
SELECT 
  n.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', t.id,
        'name', t.name,
        'slug', t.slug,
        'color', t.color
      ) ORDER BY t.name
    ) FILTER (WHERE t.id IS NOT NULL),
    '[]'
  ) as tag_list
FROM news n
LEFT JOIN news_tags nt ON n.id = nt.news_id
LEFT JOIN tags t ON nt.tag_id = t.id
GROUP BY n.id;

CREATE VIEW services_with_tags 
WITH (security_invoker = true)
AS
SELECT 
  s.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', t.id,
        'name', t.name,
        'slug', t.slug,
        'color', t.color
      ) ORDER BY t.name
    ) FILTER (WHERE t.id IS NOT NULL),
    '[]'
  ) as tag_list
FROM services s
LEFT JOIN services_tags st ON s.id = st.service_id
LEFT JOIN tags t ON st.tag_id = t.id
GROUP BY s.id;

-- 4. ビューへのアクセス権限
GRANT SELECT ON news_with_tags TO anon, authenticated;
GRANT SELECT ON services_with_tags TO anon, authenticated;

