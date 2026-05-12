// src/app/components/products/product-list/product-list.component.ts
//
// Signal patterns:
//   signal()   — searchTerm, selectedCategory
//   computed() — filtered (derives from products + searchTerm + selectedCategory)
//   effect()   — none (filtered is purely reactive via computed)

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {

  readonly svc     = inject(ProductService);
  readonly cartSvc = inject(CartService);
  readonly auth    = inject(AuthService);

  //  Writable signals 
  readonly searchTerm        = signal('');
  readonly selectedCategory  = signal<number | null>(null);
  readonly addingProductId   = signal<number | null>(null);
  readonly addedMsg          = signal<string | null>(null);

  //  Computed signals 
  readonly filtered = computed(() => {
    const term    = this.searchTerm().toLowerCase().trim();
    const catId   = this.selectedCategory();
    let list      = this.svc.products();

    if (catId) {
      list = list.filter(p => p.category?.id === catId);
    }
    if (term) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(term) ||
        (p.brand ?? '').toLowerCase().includes(term) ||
        (p.description ?? '').toLowerCase().includes(term)
      );
    }
    return list;
  });

  ngOnInit(): void {
    this.svc.loadAll();
    this.svc.loadCategories();
  }

  selectCategory(id: number | null): void {
    this.selectedCategory.set(id);
  }

  addToCart(productId: number): void {
    if (!this.auth.isLoggedIn()) return;
    this.addingProductId.set(productId);
    this.cartSvc.addItem(productId, 1).subscribe({
      next: () => {
        this.addingProductId.set(null);
        this.addedMsg.set('Added to cart!');
        setTimeout(() => this.addedMsg.set(null), 2000);
      },
      error: () => this.addingProductId.set(null)
    });
  }

  effectivePrice(p: Product): number {
    if (!p.discountPercent) return p.price;
    return p.price * (1 - p.discountPercent / 100);
  }

  getVal(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  trackById(_i: number, p: Product): number { return p.id; }
}
