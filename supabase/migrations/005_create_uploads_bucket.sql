-- Supabase Storageバケット作成マイグレーション

-- uploadsバケットを作成（公開バケット）
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- バケットへのアクセスポリシーを設定
-- 公開読み取り可能
CREATE POLICY IF NOT EXISTS "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'uploads' );

-- サービスロールによる完全アクセス（アップロード・削除）
CREATE POLICY IF NOT EXISTS "Service role full access"
  ON storage.objects FOR ALL
  USING ( bucket_id = 'uploads' AND auth.role() = 'service_role' )
  WITH CHECK ( bucket_id = 'uploads' AND auth.role() = 'service_role' );


