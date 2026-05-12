# Choppee Frontend — Angular 21 Client (Signals)

An Angular 21 single-page application that consumes the **Choppee** Spring Boot REST API.
All reactive state is managed with **Angular Signals** — no NgRx, no BehaviorSubjects.

## Signal patterns demonstrated

| Pattern | Where used |
|---------|-----------|
| `signal()` | Writable state in every service and component |
| `computed()` | Derived state: `filtered`, `effectivePrice`, `isValid`, `itemCount`, `isLoggedIn` |
| `effect()` | Side-effects: load product/order when route `:id` changes |
| `input()` | Route params flow directly into components via `withComponentInputBinding()` |
| Interpolation `{{ sig() }}` | All templates |
| Property Binding `[prop]="sig()"` | `[disabled]`, `[value]`, `[class]`, `[routerLink]` |
| Event Binding `(event)="sig.set()"` | `(input)`, `(click)`, `(change)` |
| Two-Way pattern `[value]="s()" + (input)="s.set()"` | All form fields |

## Project structure

```
src/app/
├── models/         product, cart, order, auth TypeScript interfaces
├── services/       AuthService, ProductService, CartService, OrderService
│                   jwtInterceptor (functional HTTP interceptor)
├── guards/         authGuard (functional CanActivate)
└── components/
    ├── home/               Landing page (featured products + deals)
    ├── products/
    │   ├── product-list/   Browseable, searchable, filterable by category
    │   └── product-detail/ Product info + add-to-cart with qty selector
    ├── cart/               View cart, update quantities, remove items
    ├── checkout/           Order placement form
    ├── orders/
    │   ├── order-list/     Order history table
    │   └── order-detail/   Full order breakdown
    └── auth/
        ├── login/          JWT login form
        └── register/       New user registration form
```

## Prerequisites

- Node 18+ and npm 9+
- The **Choppee Spring Boot backend** running on `http://localhost:8080`
  (see the `choppee/` folder in the root of this repo)

## Run in development

```bash
cd choppee-frontend
npm install
npm run start:proxy   # proxy /api → http://localhost:8080
```

Open `http://localhost:4200`

## Build for production

```bash
npm run build
```

Output is written to `dist/choppee-frontend/`.

## Backend API endpoints consumed

| Method | Endpoint | Auth? |
|--------|----------|-------|
| POST | `/api/auth/login` | — |
| POST | `/api/auth/register` | — |
| GET | `/api/products` | — |
| GET | `/api/products/:id` | — |
| GET | `/api/products/featured` | — |
| GET | `/api/products/deals` | — |
| GET | `/api/categories` | — |
| GET | `/api/cart` | JWT |
| POST | `/api/cart/add` | JWT |
| PUT | `/api/cart/update` | JWT |
| DELETE | `/api/cart/remove/:itemId` | JWT |
| POST | `/api/checkout/place` | JWT |
| GET | `/api/orders` | JWT |
| GET | `/api/orders/:id` | JWT |
