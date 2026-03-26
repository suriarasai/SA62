// src/app/app.routes.ts

import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default → employee list
  { path: '', redirectTo: 'employees', pathMatch: 'full' },

  // List all employees
  {
    path: 'employees',
    loadComponent: () =>
      import('./components/employee-list/employee-list.component')
        .then(m => m.EmployeeListComponent),
    title: 'Employees'
  },

  // Create new — must be declared BEFORE :id/edit to avoid clash
  {
    path: 'employees/new',
    loadComponent: () =>
      import('./components/employee-form/employee-form.component')
        .then(m => m.EmployeeFormComponent),
    title: 'New Employee'
  },

  // Edit existing
  {
    path: 'employees/:id/edit',
    loadComponent: () =>
      import('./components/employee-form/employee-form.component')
        .then(m => m.EmployeeFormComponent),
    title: 'Edit Employee'
  },

  // Fallback
  { path: '**', redirectTo: 'employees' }
];
