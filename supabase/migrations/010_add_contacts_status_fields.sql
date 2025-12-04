-- contactsテーブルにstatus、company、phoneカラムを追加

-- statusカラム（ステータス管理用）
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT '未対応';

-- companyカラム（会社名）
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company TEXT;

-- phoneカラム（電話番号）
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS phone TEXT;

-- statusカラムにインデックスを作成（ステータスでのフィルタリング用）
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

-- コメントを追加
COMMENT ON COLUMN contacts.status IS 'お問い合わせのステータス（未対応/対応中/完了）';
COMMENT ON COLUMN contacts.company IS '会社名';
COMMENT ON COLUMN contacts.phone IS '電話番号';
