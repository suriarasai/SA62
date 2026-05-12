// src/app/services/cart.service.ts
//
// Signal patterns:
//   signal()   — cart, isLoading, error
//   computed() — itemCount (cart badge), total

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';
import { Cart } from '../models/cart.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {

  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  //  Writable signals 
  readonly cart      = signal<Cart | null>(null);
  readonly isLoading = signal(false);
  readonly error     = signal<string | null>(null);

  //  Computed signals 
  readonly itemCount = computed(() => this.cart()?.totalItems ?? 0);
  readonly total     = computed(() => this.cart()?.total ?? 0);

  private get headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: this.auth.getAuthHeader() });
  }

  // GET /api/cart 
  load(): void {
    if (!this.auth.isLoggedIn()) return;
    this.isLoading.set(true);
    this.error.set(null);
    this.http.get<Cart>('/api/cart', { headers: this.headers }).pipe(
      tap(c => { this.cart.set(c); this.isLoading.set(false); }),
      catchError(err => {
        this.isLoading.set(false);
        this.error.set(err?.error?.message ?? 'Failed to load cart.');
        return throwError(() => err);
      })
    ).subscribe();
  }

  // POST /api/cart/add 
  addItem(productId: number, quantity = 1) {
    this.error.set(null);
    return this.http.post<Cart>(
      '/api/cart/add',
      { productId, quantity },
      { headers: this.headers }
    ).pipe(
      tap(c => this.cart.set(c)),
      catchError(err => {
        this.error.set(err?.error?.message ?? 'Failed to add item.');
        return throwError(() => err);
      })
    );
  }

  // PUT /api/cart/update 
  updateItem(cartItemId: number, quantity: number) {
    this.error.set(null);
    return this.http.put<Cart>(
      '/api/cart/update',
      { cartItemId, quantity },
      { headers: this.headers }
    ).pipe(
      tap(c => this.cart.set(c)),
      catchError(err => {
        this.error.set(err?.error?.message ?? 'Failed to update item.');
        return throwError(() => err);
      })
    );
  }

  // DELETE /api/cart/remove/:itemId 
  removeItem(itemId: number) {
    this.error.set(null);
    return this.http.delete<Cart>(
      `/api/cart/remove/${itemId}`,
      { headers: this.headers }
    ).pipe(
      tap(c => this.cart.set(c)),
      catchError(err => {
        this.error.set(err?.error?.message ?? 'Failed to remove item.');
        return throwError(() => err);
      })
    );
  }

  /** Clear local cart state on logout */
  clear(): void {
    this.cart.set(null);
  }
}
