// src/app/components/home/home.component.ts
//
// Signal patterns:
//   signal()   — featuredProducts, deals, isLoading
//   computed() — hasDeals

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  readonly productSvc = inject(ProductService);
  readonly cartSvc    = inject(CartService);
  readonly auth       = inject(AuthService);

  //  Writable signals 
  readonly featuredProducts = signal<Product[]>([]);
  readonly deals            = signal<Product[]>([]);
  readonly isLoading        = signal(true);
  readonly addedMsg         = signal<string | null>(null);

  //  Computed signals 
  readonly hasDeals = computed(() => this.deals().length > 0);

  ngOnInit(): void {
    this.productSvc.loadFeatured().subscribe({
      next: products => {
        this.featuredProducts.set(products);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
    this.productSvc.loadDeals().subscribe({
      next: products => this.deals.set(products)
    });
  }

  addToCart(productId: number): void {
    if (!this.auth.isLoggedIn()) return;
    this.cartSvc.addItem(productId, 1).subscribe({
      next: () => {
        this.addedMsg.set('Added to cart!');
        setTimeout(() => this.addedMsg.set(null), 2000);
      }
    });
  }

  effectivePrice(p: Product): number {
    if (!p.discountPercent) return p.price;
    return p.price * (1 - p.discountPercent / 100);
  }

  trackById(_i: number, p: Product): number { return p.id; }
}
