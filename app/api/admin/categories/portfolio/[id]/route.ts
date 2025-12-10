import { createCategoryIdHandlers } from "@/lib/api/category-handlers";

const handlers = createCategoryIdHandlers({
  tableName: 'portfolio_categories',
  defaultColor: '#10B981',
  entityName: 'portfolio',
});

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
