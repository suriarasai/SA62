// src/app/components/orders/order-list/order-list.component.ts
//
// Signal patterns:
//   signal()   — (all state via OrderService signals)
//   computed() — none needed; orderSvc signals suffice

import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { PurchaseOrder } from '../../../models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {

  readonly orderSvc = inject(OrderService);

  ngOnInit(): void {
    this.orderSvc.loadAll();
  }

  trackById(_i: number, o: PurchaseOrder): number { return o.id; }
}
