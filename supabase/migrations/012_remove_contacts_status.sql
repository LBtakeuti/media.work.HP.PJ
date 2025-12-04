-- contactsテーブルからstatusカラムを削除

-- statusカラムのインデックスを削除
DROP INDEX IF EXISTS idx_contacts_status;

-- statusカラムを削除
ALTER TABLE contacts DROP COLUMN IF EXISTS status;
