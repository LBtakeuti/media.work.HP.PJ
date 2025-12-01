-- portfoliosテーブルにsort_orderカラムを追加（存在しない場合）
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- インデックスを追加
CREATE INDEX IF NOT EXISTS idx_portfolios_sort_order ON portfolios(sort_order);

-- コメント
COMMENT ON COLUMN portfolios.sort_order IS '表示順序（小さいほど先に表示）';

