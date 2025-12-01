-- ポートフォリオカテゴリ管理マイグレーション
-- ニュースカテゴリ・サービスカテゴリと同じ構造

-- ポートフォリオカテゴリマスタテーブル
CREATE TABLE IF NOT EXISTS portfolio_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#10B981',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE portfolio_categories IS 'ポートフォリオカテゴリマスタ';
COMMENT ON COLUMN portfolio_categories.name IS 'カテゴリ名';
COMMENT ON COLUMN portfolio_categories.slug IS 'URLスラッグ';
COMMENT ON COLUMN portfolio_categories.color IS '表示カラー';
COMMENT ON COLUMN portfolio_categories.sort_order IS '表示順';

-- インデックス
CREATE INDEX IF NOT EXISTS idx_portfolio_categories_sort_order ON portfolio_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_categories_slug ON portfolio_categories(slug);

-- ポートフォリオ・カテゴリ関連テーブル（多対多）
CREATE TABLE IF NOT EXISTS portfolio_category_relations (
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES portfolio_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (portfolio_id, category_id)
);

COMMENT ON TABLE portfolio_category_relations IS 'ポートフォリオ・カテゴリ関連';
COMMENT ON COLUMN portfolio_category_relations.portfolio_id IS 'ポートフォリオID';
COMMENT ON COLUMN portfolio_category_relations.category_id IS 'カテゴリID';

-- インデックス
CREATE INDEX IF NOT EXISTS idx_portfolio_category_relations_portfolio_id ON portfolio_category_relations(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_category_relations_category_id ON portfolio_category_relations(category_id);

-- portfoliosテーブルの拡張
-- 表示形式: 'youtube' または 'gallery'
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS display_type VARCHAR(20) DEFAULT 'youtube' CHECK (display_type IN ('youtube', 'gallery'));

-- 画像ギャラリー用（JSON配列で複数画像URLを保存）
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 参照リンク（任意）
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS reference_url TEXT;

-- youtube_urlをnullableに変更（画像ギャラリー形式では不要なため）
ALTER TABLE portfolios ALTER COLUMN youtube_url DROP NOT NULL;

-- インデックス
CREATE INDEX IF NOT EXISTS idx_portfolios_display_type ON portfolios(display_type);

-- コメント
COMMENT ON COLUMN portfolios.display_type IS '表示形式: youtube（YouTube動画）または gallery（画像ギャラリー）';
COMMENT ON COLUMN portfolios.images IS '画像URLの配列（ギャラリー形式用）';
COMMENT ON COLUMN portfolios.reference_url IS '参照リンクURL（任意）';

-- updated_at自動更新トリガー
CREATE TRIGGER update_portfolio_categories_updated_at
  BEFORE UPDATE ON portfolio_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS有効化
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_category_relations ENABLE ROW LEVEL SECURITY;

-- 公開読み取り可能
CREATE POLICY "Allow public read access on portfolio_categories"
  ON portfolio_categories FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on portfolio_category_relations"
  ON portfolio_category_relations FOR SELECT
  USING (true);

-- サービスロールによる完全アクセス
CREATE POLICY "Allow service role full access on portfolio_categories"
  ON portfolio_categories FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on portfolio_category_relations"
  ON portfolio_category_relations FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- portfoliosテーブルのRLS設定
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'portfolios' AND rowsecurity = true
  ) THEN
    ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- 既存のポリシーを削除してから再作成
DROP POLICY IF EXISTS "Allow public read access on portfolios" ON portfolios;
DROP POLICY IF EXISTS "Allow service role full access on portfolios" ON portfolios;

-- 公開読み取り可能
CREATE POLICY "Allow public read access on portfolios"
  ON portfolios FOR SELECT
  USING (published = true);

-- サービスロールによる完全アクセス
CREATE POLICY "Allow service role full access on portfolios"
  ON portfolios FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 初期カテゴリデータの投入
INSERT INTO portfolio_categories (name, slug, color, sort_order) VALUES
  ('Event', 'event', '#EF4444', 1),
  ('Web Design', 'web-design', '#3B82F6', 2),
  ('Graphic Design', 'graphic-design', '#8B5CF6', 3),
  ('Movie', 'movie', '#EC4899', 4),
  ('Other', 'other', '#6B7280', 5)
ON CONFLICT (slug) DO NOTHING;

