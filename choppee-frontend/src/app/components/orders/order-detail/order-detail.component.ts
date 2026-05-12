// src/app/components/orders/order-detail/order-detail.component.ts
//
// Signal patterns:
//   input()    — :id route param via withComponentInputBinding()
//   effect()   — loads order when id() changes
//   computed() — from orderSvc: selected()

import { Component, inject, input, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent {

  readonly orderSvc = inject(OrderService);

  // Route param :id → input() signal (withComponentInputBinding)
  readonly id = input<string | undefined>(undefined);

  constructor() {
    //  effect() — load order when id() changes 
    effect(() => {
      const rawId = this.id();
      if (rawId) {
        this.orderSvc.selected.set(null);
        this.orderSvc.getById(Number(rawId)).subscribe();
      }
    });
  }
}
