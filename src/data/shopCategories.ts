import { products } from './products';

export const concernCategories = [...new Set(products.map(p => p.category))].sort();
export const productForms = [...new Set(products.map(p => p.form).filter(Boolean))].sort() as string[];
export const filterTags = [...new Set(products.flatMap(p => p.tags ?? []))].sort();
export const filterCollections = [...new Set([
  ...products.map(p => p.category),
  ...products.flatMap(p => p.tags ?? [])
])].sort();
