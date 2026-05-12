// src/app/components/products/product-detail/product-detail.component.ts
//
// Signal patterns:
//   input()    — receives :id route param as a signal (withComponentInputBinding)
//   signal()   — quantity, addedMsg, isAdding
//   computed() — effectivePrice, savingsAmount, isInStock, pageTitle
//   effect()   — loads product data when id() changes

import { Component, inject, signal, computed, input, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent {

  readonly svc     = inject(ProductService);
  readonly cartSvc = inject(CartService);
  readonly auth    = inject(AuthService);

  // Route param :id → input() signal (withComponentInputBinding in app.config)
  readonly id = input<string | undefined>(undefined);

  //  Form signals 
  readonly quantity  = signal(1);
  readonly isAdding  = signal(false);
  readonly addedMsg  = signal<string | null>(null);

  //  Computed signals 
  readonly effectivePrice = computed(() => {
    const p = this.svc.selected();
    if (!p) return 0;
    if (!p.discountPercent) return p.price;
    return p.price * (1 - p.discountPercent / 100);
  });

  readonly savingsAmount = computed(() => {
    const p = this.svc.selected();
    if (!p || !p.discountPercent) return 0;
    return p.price - this.effectivePrice();
  });

  readonly isInStock = computed(() => {
    const p = this.svc.selected();
    return !!p && (p.stockQuantity ?? 0) > 0;
  });

  readonly maxQty = computed(() => {
    const p = this.svc.selected();
    return p?.stockQuantity ?? 1;
  });

  constructor() {
    //  effect() — when id() changes, load the product 
    effect(() => {
      const rawId = this.id();
      if (rawId) {
        this.svc.selected.set(null);
        this.svc.getById(Number(rawId)).subscribe();
      }
    });
  }

  increaseQty(): void {
    const max = this.maxQty();
    this.quantity.update(q => Math.min(q + 1, max));
  }

  decreaseQty(): void {
    this.quantity.update(q => Math.max(q - 1, 1));
  }

  addToCart(): void {
    const p = this.svc.selected();
    if (!p || !this.auth.isLoggedIn()) return;
    this.isAdding.set(true);
    this.cartSvc.addItem(p.id, this.quantity()).subscribe({
      next: () => {
        this.isAdding.set(false);
        this.addedMsg.set(`Added ${this.quantity()} × "${p.name}" to your cart.`);
        this.quantity.set(1);
        setTimeout(() => this.addedMsg.set(null), 3000);
      },
      error: () => this.isAdding.set(false)
    });
  }
}
