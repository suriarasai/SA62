// src/app/services/product.service.ts
//
// Signal patterns:
//   signal()   — products, categories, selected product, isLoading, error
//   computed() — total count, deals, featured

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';
import { Product, Category } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private readonly http = inject(HttpClient);

  //  Writable signals 
  readonly products   = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly selected   = signal<Product | null>(null);
  readonly isLoading  = signal(false);
  readonly error      = signal<string | null>(null);

  //  Computed signals 
  readonly total      = computed(() => this.products().length);
  readonly deals      = computed(() =>
    this.products().filter(p => (p.discountPercent ?? 0) > 0)
  );
  readonly featured   = computed(() =>
    this.products().filter(p => p.active).slice(0, 6)
  );

  // GET /api/products 
  loadAll(q?: string, categoryId?: number): void {
    this.isLoading.set(true);
    this.error.set(null);
    let url = '/api/products';
    const params: string[] = [];
    if (q) params.push(`q=${encodeURIComponent(q)}`);
    if (categoryId) params.push(`category=${categoryId}`);
    if (params.length) url += '?' + params.join('&');

    this.http.get<Product[]>(url).pipe(
      tap(data => { this.products.set(data); this.isLoading.set(false); }),
      catchError(err => {
        this.isLoading.set(false);
        this.error.set(err?.error?.message ?? err.message ?? 'Failed to load products.');
        return throwError(() => err);
      })
    ).subscribe();
  }

  // GET /api/products/:id 
  getById(id: number) {
    this.isLoading.set(true);
    this.error.set(null);
    return this.http.get<Product>(`/api/products/${id}`).pipe(
      tap(p => { this.selected.set(p); this.isLoading.set(false); }),
      catchError(err => {
        this.isLoading.set(false);
        this.error.set(err?.error?.message ?? 'Product not found.');
        return throwError(() => err);
      })
    );
  }

  // GET /api/categories 
  loadCategories(): void {
    this.http.get<Category[]>('/api/categories').pipe(
      tap(data => this.categories.set(data)),
      catchError(() => throwError(() => null))
    ).subscribe();
  }

  // GET /api/products/featured 
  loadFeatured() {
    return this.http.get<Product[]>('/api/products/featured');
  }

  // GET /api/products/deals 
  loadDeals() {
    return this.http.get<Product[]>('/api/products/deals');
  }
}
