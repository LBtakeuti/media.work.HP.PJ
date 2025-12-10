import CategoryManagement from "@/components/admin/CategoryManagement";

export default function AdminPortfolioCategoriesPage() {
  return (
    <CategoryManagement
      title="ポートフォリオカテゴリ管理"
      description="ポートフォリオに設定するカテゴリを管理します。"
      apiPath="/api/admin/categories/portfolio"
      defaultColor="#10B981"
      placeholder="例: Event"
    />
  );
}
