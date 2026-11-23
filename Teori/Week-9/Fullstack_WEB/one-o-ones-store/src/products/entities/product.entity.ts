export const PRODUCT_CATEGORIES = [
  'Vinyl',
  'Cassette',
  'Apparel',
  'Collectible',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_ICONS = [
  'disc',
  'cassette',
  'cube',
  'apparel',
  'bolt',
  'star',
  'globe',
  'sparkles',
] as const;

export type ProductIconType = (typeof PRODUCT_ICONS)[number];

export const PRODUCT_THEME_COLORS = [
  'amber',
  'cyan',
  'teal',
  'purple',
  'pink',
] as const;

export type ProductThemeColor = (typeof PRODUCT_THEME_COLORS)[number];

/**
 * Entity Product (Model dalam arsitektur MVC NestJS)
 * Merepresentasikan data utama katalog merchandise & rilisan musik ONE 'O ONES Official Store.
 */
export class Product {
  id: number;
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  editionBadge: string;
  description: string;
  icon: ProductIconType;
  themeColor: ProductThemeColor;
  releaseDate: string;
  isLimitedEdition: boolean;
  createdAt: string;
  updatedAt: string;
}
