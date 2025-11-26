-- newsテーブルに画像表示モードのカラムを追加
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS image_display_mode VARCHAR(20) DEFAULT 'contain' CHECK (image_display_mode IN ('contain', 'cover'));

-- servicesテーブルに画像表示モードのカラムを追加
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS image_display_mode VARCHAR(20) DEFAULT 'contain' CHECK (image_display_mode IN ('contain', 'cover'));

COMMENT ON COLUMN news.image_display_mode IS '画像表示モード: contain=比率を保つ（余白あり）, cover=フル表示（見切れあり）';
COMMENT ON COLUMN services.image_display_mode IS '画像表示モード: contain=比率を保つ（余白あり）, cover=フル表示（見切れあり）';
