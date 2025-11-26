-- servicesテーブルにcategoryカラムを追加（存在しない場合）
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'サービスカテゴリ';

-- 既存のデータを確認
SELECT id, title, category FROM services;
