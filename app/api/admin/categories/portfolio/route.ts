import { createCategoryHandlers } from "@/lib/api/category-handlers";

const handlers = createCategoryHandlers({
  tableName: 'portfolio_categories',
  defaultColor: '#10B981',
  entityName: 'portfolio',
});

export const GET = handlers.GET;
export const POST = handlers.POST;
