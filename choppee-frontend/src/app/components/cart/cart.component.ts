// src/app/components/cart/cart.component.ts
//
// Signal patterns:
//   signal()   — confirmRemoveId, isRemoving, updateMsg
//   computed() — isEmpty, from CartService: cart(), itemCount(), total()
//   effect()   — none (cart loaded in ngOnInit)

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {

  readonly cartSvc = inject(CartService);

  //  Writable signals 
  readonly confirmRemoveId = signal<number | null>(null);
  readonly isRemoving      = signal(false);
  readonly updatingItemId  = signal<number | null>(null);
  readonly updateMsg       = signal<{ ok: boolean; text: string } | null>(null);

  //  Computed signal 
  readonly isEmpty = computed(() =>
    !this.cartSvc.cart() || this.cartSvc.cart()!.items.length === 0
  );

  ngOnInit(): void {
    this.cartSvc.load();
  }

  /** Called when user changes the quantity input */
  onQtyChange(itemId: number, event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    if (val < 1) return;
    this.updatingItemId.set(itemId);
    this.cartSvc.updateItem(itemId, val).subscribe({
      next: () => {
        this.updatingItemId.set(null);
        this.updateMsg.set({ ok: true, text: 'Cart updated.' });
        setTimeout(() => this.updateMsg.set(null), 2000);
      },
      error: () => {
        this.updatingItemId.set(null);
        this.updateMsg.set({ ok: false, text: 'Failed to update quantity.' });
      }
    });
  }

  askRemove(itemId: number): void {
    this.confirmRemoveId.set(itemId);
    this.updateMsg.set(null);
  }

  cancelRemove(): void {
    this.confirmRemoveId.set(null);
  }

  doRemove(): void {
    const id = this.confirmRemoveId();
    if (id == null) return;
    this.isRemoving.set(true);
    this.cartSvc.removeItem(id).subscribe({
      next: () => {
        this.isRemoving.set(false);
        this.confirmRemoveId.set(null);
        this.updateMsg.set({ ok: true, text: 'Item removed from cart.' });
        setTimeout(() => this.updateMsg.set(null), 2000);
      },
      error: () => {
        this.isRemoving.set(false);
        this.confirmRemoveId.set(null);
      }
    });
  }
}
