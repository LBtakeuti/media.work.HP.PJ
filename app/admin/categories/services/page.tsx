import CategoryManagement from "@/components/admin/CategoryManagement";

export default function AdminServiceCategoriesPage() {
  return (
    <CategoryManagement
      title="サービスカテゴリ管理"
      description="サービスに設定するカテゴリを管理します。"
      apiPath="/api/admin/categories/services"
      defaultColor="#10B981"
      placeholder="例: Webサービス"
    />
  );
}
