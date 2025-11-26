-- 既存のサービスとタグを紐付ける
-- tagsの値に基づいてservice_tagsからタグを探し、service_tag_relationsに紐付けを作成

-- まず、servicesテーブルにtagsカラムがあるか確認
-- もしtagsカラムがあれば、それを使用して紐付ける
-- ない場合は、何も実行しない

-- Note: servicesテーブルにはtagsカラムがないため、
-- 管理画面から手動でタグを設定する必要があります
