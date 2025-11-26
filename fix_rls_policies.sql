-- 既存の重複ポリシーを削除して、適切なポリシーのみ残す

-- service_tagsテーブルのポリシーをクリーンアップ
DROP POLICY IF EXISTS "Allow all operations for public" ON service_tags;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON service_tags;
DROP POLICY IF EXISTS "Enable read access for all users" ON service_tags;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON service_tags;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON service_tags;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON service_tags;

-- 新しい統一されたポリシーを作成
CREATE POLICY "Allow authenticated users full access to service_tags"
ON service_tags
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public read access to service_tags"
ON service_tags
FOR SELECT
TO public
USING (true);

-- servicesテーブルのポリシーをクリーンアップ
DROP POLICY IF EXISTS "Allow all operations for public" ON services;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON services;
DROP POLICY IF EXISTS "Enable read access for all users" ON services;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON services;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON services;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON services;

-- 新しい統一されたポリシーを作成
CREATE POLICY "Allow authenticated users full access to services"
ON services
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public read access to services"
ON services
FOR SELECT
TO public
USING (true);

-- news_tagsテーブルも同様にクリーンアップ
DROP POLICY IF EXISTS "Allow all operations for public" ON news_tags;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON news_tags;

CREATE POLICY "Allow authenticated users full access to news_tags"
ON news_tags
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public read access to news_tags"
ON news_tags
FOR SELECT
TO public
USING (true);

-- newsテーブルも同様にクリーンアップ
DROP POLICY IF EXISTS "Allow all operations for public" ON news;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON news;
DROP POLICY IF EXISTS "Enable read access for all users" ON news;

CREATE POLICY "Allow authenticated users full access to news"
ON news
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public read access to published news"
ON news
FOR SELECT
TO public
USING (published = true);

-- contactsテーブル
DROP POLICY IF EXISTS "Allow all operations for public" ON contacts;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON contacts;

CREATE POLICY "Allow authenticated users full access to contacts"
ON contacts
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public to insert contacts"
ON contacts
FOR INSERT
TO public
WITH CHECK (true);

-- news_tag_relationsテーブル
DROP POLICY IF EXISTS "Allow all operations for public" ON news_tag_relations;

CREATE POLICY "Allow authenticated users full access to news_tag_relations"
ON news_tag_relations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public read access to news_tag_relations"
ON news_tag_relations
FOR SELECT
TO public
USING (true);

-- service_tag_relationsテーブル
DROP POLICY IF EXISTS "Allow all operations for public" ON service_tag_relations;

CREATE POLICY "Allow authenticated users full access to service_tag_relations"
ON service_tag_relations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public read access to service_tag_relations"
ON service_tag_relations
FOR SELECT
TO public
USING (true);
