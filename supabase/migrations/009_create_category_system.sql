-- ニュースとサービスのカテゴリシステム作成

-- ニュースカテゴリテーブル
CREATE TABLE IF NOT EXISTS news_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- サービスカテゴリテーブル
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ニュース-カテゴリ中間テーブル
CREATE TABLE IF NOT EXISTS news_category_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES news_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(news_id, category_id)
);

-- サービス-カテゴリ中間テーブル
CREATE TABLE IF NOT EXISTS service_category_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(service_id, category_id)
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_news_categories_sort_order ON news_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_service_categories_sort_order ON service_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_news_category_relations_news_id ON news_category_relations(news_id);
CREATE INDEX IF NOT EXISTS idx_news_category_relations_category_id ON news_category_relations(category_id);
CREATE INDEX IF NOT EXISTS idx_service_category_relations_service_id ON service_category_relations(service_id);
CREATE INDEX IF NOT EXISTS idx_service_category_relations_category_id ON service_category_relations(category_id);

-- updated_at自動更新トリガー
CREATE TRIGGER update_news_categories_updated_at
  BEFORE UPDATE ON news_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_categories_updated_at
  BEFORE UPDATE ON service_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) の有効化
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_category_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_category_relations ENABLE ROW LEVEL SECURITY;

-- 公開読み取り許可
CREATE POLICY "Allow public read access on news_categories"
  ON news_categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on service_categories"
  ON service_categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on news_category_relations"
  ON news_category_relations FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on service_category_relations"
  ON service_category_relations FOR SELECT
  USING (true);

-- サービスロールによる全アクセス許可
CREATE POLICY "Allow service role full access on news_categories"
  ON news_categories FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on service_categories"
  ON service_categories FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on news_category_relations"
  ON news_category_relations FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on service_category_relations"
  ON service_category_relations FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 既存の単一カテゴリカラムを削除（既にデータがある場合は、先にデータ移行が必要）
-- ALTER TABLE news DROP COLUMN IF EXISTS category;
-- ALTER TABLE services DROP COLUMN IF EXISTS category;
-- 注意: 上記のDROP COLUMNは、既存データを新しいカテゴリシステムに移行した後に実行すること

-- newsとservicesテーブルに必要なカラムを追加
ALTER TABLE news ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE news ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE services ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE services ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE services ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
