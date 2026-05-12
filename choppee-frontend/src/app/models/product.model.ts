// src/app/models/product.model.ts

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  price: number;
  discountPercent?: number;
  stockQuantity?: number;
  imageUrl?: string;
  createdAt?: string;
  active?: boolean;
  category?: Category;
  tags?: Tag[];
  effectivePrice?: number;
  inStock?: boolean;
}
