import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Default → home
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Home / landing
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Choppee – Home'
  },

  // Product listing
  {
    path: 'products',
    loadComponent: () =>
      import('./components/products/product-list/product-list.component')
        .then(m => m.ProductListComponent),
    title: 'Products'
  },

  // Product detail
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./components/products/product-detail/product-detail.component')
        .then(m => m.ProductDetailComponent),
    title: 'Product Detail'
  },

  // Cart (requires auth)
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/cart/cart.component').then(m => m.CartComponent),
    title: 'My Cart'
  },

  // Checkout (requires auth)
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/checkout/checkout.component')
        .then(m => m.CheckoutComponent),
    title: 'Checkout'
  },

  // Order history (requires auth)
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/orders/order-list/order-list.component')
        .then(m => m.OrderListComponent),
    title: 'My Orders'
  },

  // Order detail (requires auth)
  {
    path: 'orders/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/orders/order-detail/order-detail.component')
        .then(m => m.OrderDetailComponent),
    title: 'Order Detail'
  },

  // Login
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component')
        .then(m => m.LoginComponent),
    title: 'Login'
  },

  // Register
  {
    path: 'register',
    loadComponent: () =>
      import('./components/auth/register/register.component')
        .then(m => m.RegisterComponent),
    title: 'Register'
  },

  // Fallback
  { path: '**', redirectTo: 'home' }
];
