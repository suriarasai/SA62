// src/app/app.ts
//
// Root application component — renders the top navigation bar.
//
// Signal patterns used:
//   inject(AuthService).isLoggedIn()  — computed signal (boolean)
//   inject(AuthService).username()    — computed signal (string)
//   inject(CartService).itemCount()   — computed signal (number)

import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly auth = inject(AuthService);
  readonly cart = inject(CartService);
}
