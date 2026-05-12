// src/app/services/order.service.ts
//
// Signal patterns:
//   signal()   — orders, selected order, isLoading, error
//   computed() — orderCount

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';
import { PurchaseOrder } from '../models/order.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  //  Writable signals 
  readonly orders    = signal<PurchaseOrder[]>([]);
  readonly selected  = signal<PurchaseOrder | null>(null);
  readonly isLoading = signal(false);
  readonly error     = signal<string | null>(null);

  //  Computed signal 
  readonly orderCount = computed(() => this.orders().length);

  private get headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: this.auth.getAuthHeader() });
  }

  // GET /api/orders 
  loadAll(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.http.get<PurchaseOrder[]>('/api/orders', { headers: this.headers }).pipe(
      tap(data => { this.orders.set(data); this.isLoading.set(false); }),
      catchError(err => {
        this.isLoading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to load orders.');
        return throwError(() => err);
      })
    ).subscribe();
  }

  // GET /api/orders/:id 
  getById(id: number) {
    this.isLoading.set(true);
    this.error.set(null);
    return this.http.get<PurchaseOrder>(`/api/orders/${id}`, { headers: this.headers }).pipe(
      tap(o => { this.selected.set(o); this.isLoading.set(false); }),
      catchError(err => {
        this.isLoading.set(false);
        this.error.set(err?.error?.message ?? 'Order not found.');
        return throwError(() => err);
      })
    );
  }

  // POST /api/checkout/place 
  placeOrder(shippingAddress: string, notes: string) {
    this.isLoading.set(true);
    this.error.set(null);
    return this.http.post<PurchaseOrder>(
      '/api/checkout/place',
      { shippingAddress, notes },
      { headers: this.headers }
    ).pipe(
      tap(o => {
        this.isLoading.set(false);
        this.orders.update(list => [o, ...list]);
      }),
      catchError(err => {
        this.isLoading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to place order.');
        return throwError(() => err);
      })
    );
  }
}
