-- newsテーブルにsort_orderカラムを追加
ALTER TABLE news ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- servicesテーブルにsort_orderカラムを追加
ALTER TABLE services ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- インデックスを追加
CREATE INDEX IF NOT EXISTS idx_news_sort_order ON news(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services(sort_order);

-- コメント
COMMENT ON COLUMN news.sort_order IS '表示順序（小さいほど先に表示）';
COMMENT ON COLUMN services.sort_order IS '表示順序（小さいほど先に表示）';
