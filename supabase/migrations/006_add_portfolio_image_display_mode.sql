-- ポートフォリオテーブルに画像表示モードカラムを追加
ALTER TABLE portfolios
ADD COLUMN IF NOT EXISTS image_display_mode VARCHAR(20) DEFAULT 'cover' CHECK (image_display_mode IN ('contain', 'cover'));

COMMENT ON COLUMN portfolios.image_display_mode IS '画像表示モード: contain=比率を保つ（余白あり）, cover=フル表示（見切れあり）';
