// src/app/models/cart.model.ts

import { Product } from './product.model';

export interface CartItem {
  id: number;
  quantity: number;
  addedAt?: string;
  product: Product;
  subtotal?: number;
}

export interface Cart {
  id: number;
  createdAt?: string;
  items: CartItem[];
  total?: number;
  totalItems?: number;
}
