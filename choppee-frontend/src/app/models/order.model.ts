// src/app/models/order.model.ts

import { Product } from './product.model';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  product: Product;
  subtotal?: number;
}

export interface PurchaseOrder {
  id: number;
  totalAmount: number;
  shippingAddress?: string;
  notes?: string;
  status: OrderStatus;
  orderDate?: string;
  deliveredAt?: string;
  items: OrderItem[];
  totalQuantity?: number;
}
