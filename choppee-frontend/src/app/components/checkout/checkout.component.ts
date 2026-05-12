// src/app/components/checkout/checkout.component.ts
//
// Signal patterns:
//   signal()   — shippingAddress, notes, isPending, success, serverError, submitted
//   computed() — addrError, isValid, cartTotal, cartItems

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {

  private readonly router   = inject(Router);
  readonly cartSvc          = inject(CartService);
  readonly orderSvc         = inject(OrderService);

  //  Form field signals 
  readonly shippingAddress = signal('');
  readonly notes           = signal('');

  //  UI state signals 
  readonly isPending   = signal(false);
  readonly success     = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly submitted   = signal(false);

  //  Computed signals 
  readonly addrError = computed(() => {
    if (!this.submitted()) return null;
    const v = this.shippingAddress().trim();
    if (!v) return 'Shipping address is required.';
    if (v.length < 10) return 'Please enter a complete address (min 10 chars).';
    return null;
  });

  readonly isValid = computed(() => !this.addrError());

  readonly cartItems = computed(() => this.cartSvc.cart()?.items ?? []);
  readonly cartTotal = computed(() => this.cartSvc.total());

  ngOnInit(): void {
    this.cartSvc.load();
  }

  submit(): void {
    this.submitted.set(true);
    if (!this.isValid()) return;

    this.isPending.set(true);
    this.serverError.set(null);

    this.orderSvc.placeOrder(
      this.shippingAddress().trim(),
      this.notes().trim()
    ).subscribe({
      next: order => {
        this.isPending.set(false);
        this.success.set(true);
        this.cartSvc.clear();
        setTimeout(() => this.router.navigate(['/orders', order.id]), 1500);
      },
      error: err => {
        this.isPending.set(false);
        this.serverError.set(
          err?.error?.message ?? 'Failed to place order. Please try again.'
        );
      }
    });
  }

  str(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }
}
