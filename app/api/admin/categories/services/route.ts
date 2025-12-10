import { createCategoryHandlers } from "@/lib/api/category-handlers";

const handlers = createCategoryHandlers({
  tableName: 'service_categories',
  defaultColor: '#10B981',
  entityName: 'service',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
