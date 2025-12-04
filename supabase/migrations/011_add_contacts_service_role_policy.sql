-- contactsテーブルにservice_role用のRLSポリシーを追加
-- 管理画面のAPIがservice_roleキーを使用してcontactsを更新できるようにする

-- サービスロールによる完全アクセスを許可
CREATE POLICY IF NOT EXISTS "service_role_full_access_contacts"
  ON contacts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON POLICY "service_role_full_access_contacts" ON contacts IS '管理画面APIからのお問い合わせデータの読み取り・更新・削除を許可';
