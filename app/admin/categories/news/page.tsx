import CategoryManagement from "@/components/admin/CategoryManagement";

export default function AdminNewsCategoriesPage() {
  return (
    <CategoryManagement
      title="ニュースカテゴリ管理"
      description="ニュース記事に設定するカテゴリを管理します。"
      apiPath="/api/admin/categories/news"
      defaultColor="#3B82F6"
      placeholder="例: お知らせ"
    />
  );
}
