// src/app/app.component.ts

import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Simple top navigation bar -->
    <nav class="navbar">
      <a class="navbar-brand" routerLink="/employees">Employee Portal</a>
      <a class="navbar-link" routerLink="/employees"
         routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        All Employees
      </a>
      <a class="navbar-link" routerLink="/employees/new"
         routerLinkActive="active">
        Add Employee
      </a>
    </nav>

    <!-- Routed page goes here -->
    <router-outlet />
  `
})
export class AppComponent {}
