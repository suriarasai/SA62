// src/app/components/employee-form/employee-form.component.ts
//
// Signal patterns demonstrated:
//
//  input()      — receives the :id route param as a signal
//                 (enabled by withComponentInputBinding() in app.config.ts)
//
//  model()      — TWO-WAY BINDING primitive (Angular 21).
//                 Each form field is a ModelSignal<T>.
//                 In the template the parent writes:
//                   [(name)]="name" which is sugar for
//                   [name]="name()"  +  (nameChange)="name.set($event)"
//                 Because the fields are on THIS component, we use them
//                 directly:  name.set(value)  and  {{ name() }}
//
//  computed()   — validation errors and derived UI labels
//
//  effect()     — side-effect: load employee data when id() changes
//
//  signal()     — simple writable state (isPending, success, serverError)
//
// Template patterns:
//  {{ value() }}          Interpolation
//  [prop]="signal()"      Property Binding
//  (event)="signal.set()" Event Binding
//  [(model)]="signal"     Two-Way Binding (model() API)

import { Component, OnInit, inject, signal, computed, input, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee, DEPARTMENTS, DESIGNATIONS } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent implements OnInit {

  private readonly router = inject(Router);
  readonly svc            = inject(EmployeeService);

  //  Dropdown option lists 
  readonly departments  = DEPARTMENTS;
  readonly designations = DESIGNATIONS;

  // ── Signal-based routing: route param :id → input() signal ──────
  //
  //   withComponentInputBinding() in app.config.ts makes the router
  //   automatically set this signal whenever the URL changes.
  //   /employees/new         → id() === undefined  (create mode)
  //   /employees/42/edit     → id() === "42"       (edit mode)
  readonly id = input<string | undefined>(undefined);

  //  Form field signals 
  //
  //   signal() is used (not model()) so that withComponentInputBinding()
  //   in app.config.ts does not treat these as route inputs and
  //   overwrite the '' defaults with undefined.
  readonly name        = signal('');
  readonly department  = signal('');
  readonly salary      = signal<number | ''>('');
  readonly designation = signal('');

  //  Simple UI state signals 
  readonly isPending   = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly success     = signal(false);
  /** Turns true after the first submit attempt — gates validation display */
  readonly submitted   = signal(false);

  //  Computed signals (derived from model signals) 
  readonly isEditMode  = computed(() => !!this.id());
  readonly pageTitle   = computed(() =>
    this.isEditMode() ? `Edit Employee #${this.id()}` : 'New Employee'
  );
  readonly btnLabel    = computed(() =>
    this.isEditMode() ? 'Save Changes' : 'Create Employee'
  );

  // Validation — only visible after first submit attempt
  readonly nameError = computed(() => {
    if (!this.submitted()) return null;
    const v = this.name().trim();
    if (!v)       return 'Name is required.';
    if (v.length < 2) return 'Name must be at least 2 characters.';
    return null;
  });
  readonly salaryError = computed(() => {
    if (!this.submitted()) return null;
    const v = this.salary();
    if (v === '' || v == null) return 'Salary is required.';
    if (+v < 5500)             return 'Minimum salary is $5,500.';
    return null;
  });
  readonly deptError = computed(() =>
    this.submitted() && !this.department() ? 'Department is required.' : null
  );
  readonly desigError = computed(() =>
    this.submitted() && !this.designation() ? 'Designation is required.' : null
  );
  readonly isValid = computed(() =>
    !this.nameError() && !this.salaryError() && !this.deptError() && !this.desigError()
  );

  //  Effect: when id() changes, load the employee for editing 
  constructor() {
    effect(() => {
      const rawId = this.id();
      if (rawId) {
        this.loadForEdit(Number(rawId));
      }
    });
  }

  ngOnInit(): void {}

  //  Load employee into form fields 
  private loadForEdit(id: number): void {
    this.isPending.set(true);
    this.serverError.set(null);
    this.svc.getById(id).subscribe({
      next: emp => {
        // model().set() writes the two-way bound signal
        this.name.set(emp.name);
        this.department.set(emp.department);
        this.salary.set(emp.salary);
        this.designation.set(emp.designation);
        this.isPending.set(false);
      },
      error: err => {
        this.serverError.set(err?.error?.message ?? 'Could not load employee.');
        this.isPending.set(false);
      }
    });
  }

  //  Submit (create or update) 
  submit(): void {
    this.submitted.set(true);
    if (!this.isValid()) return;

    const payload: Employee = {
      name:        this.name().trim(),
      department:  this.department(),
      salary:      Number(this.salary()),
      designation: this.designation()
    };

    this.isPending.set(true);
    this.serverError.set(null);

    if (this.isEditMode()) {
      const numId = Number(this.id());
      payload.id = numId;
      this.svc.update(numId, payload).subscribe({
        next:  () => this.onSuccess(),
        error: err => this.onError(err)
      });
    } else {
      this.svc.create(payload).subscribe({
        next:  () => this.onSuccess(),
        error: err => this.onError(err)
      });
    }
  }

  private onSuccess(): void {
    this.isPending.set(false);
    this.success.set(true);
    setTimeout(() => this.router.navigate(['/employees']), 1200);
  }

  private onError(err: unknown): void {
    this.isPending.set(false);
    const e = err as { error?: { message?: string }; message?: string };
    this.serverError.set(e?.error?.message ?? e?.message ?? 'Request failed.');
  }

  //  Event helper: reads typed value from an <input> 
  str(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  //  Event helper: reads typed value from a <select> 
  sel(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  //  Event helper: reads a number from an <input type=number> 
  num(event: Event): number | '' {
    const v = (event.target as HTMLInputElement).value;
    return v === '' ? '' : Number(v);
  }
}
