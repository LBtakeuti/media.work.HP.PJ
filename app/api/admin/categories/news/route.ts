import { createCategoryHandlers } from "@/lib/api/category-handlers";

const handlers = createCategoryHandlers({
  tableName: 'news_categories',
  defaultColor: '#3B82F6',
  entityName: 'news',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
