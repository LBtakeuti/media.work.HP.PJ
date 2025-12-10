import { createCategoryIdHandlers } from "@/lib/api/category-handlers";

const handlers = createCategoryIdHandlers({
  tableName: 'service_categories',
  defaultColor: '#10B981',
  entityName: 'service',
});

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
