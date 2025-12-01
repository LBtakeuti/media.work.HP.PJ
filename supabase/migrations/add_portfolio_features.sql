-- ポートフォリオカテゴリマスタテーブルを作成
CREATE TABLE IF NOT EXISTS portfolio_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_portfolio_categories_sort_order ON portfolio_categories(sort_order);

-- コメント
COMMENT ON TABLE portfolio_categories IS 'ポートフォリオカテゴリマスタ';
COMMENT ON COLUMN portfolio_categories.name IS 'カテゴリ名';
COMMENT ON COLUMN portfolio_categories.sort_order IS '表示順序（小さいほど先に表示）';

-- ポートフォリオテーブルに新しいカラムを追加

-- 投稿形態: 'youtube' または 'gallery'
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS display_type VARCHAR(20) DEFAULT 'youtube';

-- カテゴリID（外部キー）
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES portfolio_categories(id) ON DELETE SET NULL;

-- 画像ギャラリー用（JSON配列で複数画像URLを保存）
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 参照リンク
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS reference_url TEXT;

-- youtube_urlをnullable に変更（画像ギャラリー形式では不要なため）
ALTER TABLE portfolios ALTER COLUMN youtube_url DROP NOT NULL;

-- 旧categoryカラムがあれば削除（category_idに移行）
-- ALTER TABLE portfolios DROP COLUMN IF EXISTS category;

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_portfolios_category_id ON portfolios(category_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_display_type ON portfolios(display_type);

-- コメント
COMMENT ON COLUMN portfolios.display_type IS '表示形式: youtube（YouTube動画）または gallery（画像ギャラリー）';
COMMENT ON COLUMN portfolios.category_id IS 'カテゴリID（portfolio_categoriesへの外部キー）';
COMMENT ON COLUMN portfolios.images IS '画像URLの配列（ギャラリー形式用）';
COMMENT ON COLUMN portfolios.reference_url IS '参照リンクURL';
