-- contactsテーブルにcompanyカラムを追加

ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company TEXT;
