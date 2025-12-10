import { createCategoryIdHandlers } from "@/lib/api/category-handlers";

const handlers = createCategoryIdHandlers({
  tableName: 'news_categories',
  defaultColor: '#3B82F6',
  entityName: 'news',
});

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
