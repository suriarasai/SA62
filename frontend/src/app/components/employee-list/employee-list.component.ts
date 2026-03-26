// src/app/components/employee-list/employee-list.component.ts
//
// Signal patterns used here:
//  • signal()        — writable local state
//  • computed()      — derived filtered list; reacts automatically
//  • empService signals — employees(), isLoading(), error(), total(), avgSalary()
//  • Interpolation   — {{ value() }} in the template
//  • Property Binding— [disabled]="signal()", [value]="signal()"
//  • Event Binding   — (input)="signal.set(...)", (click)="fn()"
//  • Two-Way Binding — [(searchTerm)]="searchTerm" on the child input
//                      (implemented via model() in Angular 21)

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {

  readonly svc = inject(EmployeeService);

  // ── Local writable signals ─────────────────────────────────

  /**
   * searchTerm is a writable signal.
   * The template writes to it with Event Binding:
   *   (input)="searchTerm.set($event.target.value)"
   * and reads it with Interpolation:
   *   {{ searchTerm() }}
   */
  readonly searchTerm = signal('');

  /** ID of the employee waiting for delete confirmation; null = dialog closed */
  readonly pendingDeleteId = signal<number | null>(null);

  /** True while a delete HTTP call is in flight */
  readonly isDeleting = signal(false);

  /** Feedback message shown after a delete attempt */
  readonly deleteMsg = signal<{ ok: boolean; text: string } | null>(null);

  // ── Computed signals ───────────────────────────────────────

  /**
   * filtered() recomputes automatically whenever searchTerm() or
   * svc.employees() changes — no manual subscriptions needed.
   */
  readonly filtered = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.svc.employees();
    return this.svc.employees().filter(e =>
      e.name.toLowerCase().includes(term)       ||
      e.department.toLowerCase().includes(term) ||
      e.designation.toLowerCase().includes(term)
    );
  });

  // ── Lifecycle ──────────────────────────────────────────────

  ngOnInit(): void {
    this.svc.loadAll();
  }

  // ── Delete flow ────────────────────────────────────────────

  /** Open confirm dialog for the given employee */
  askDelete(id: number): void {
    this.pendingDeleteId.set(id);
    this.deleteMsg.set(null);
  }

  /** Close confirm dialog without doing anything */
  cancelDelete(): void {
    this.pendingDeleteId.set(null);
  }

  /** Execute the delete after user confirms */
  doDelete(): void {
    const id = this.pendingDeleteId();
    if (id == null) return;
    this.isDeleting.set(true);
    this.svc.delete(id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.pendingDeleteId.set(null);
        this.deleteMsg.set({ ok: true, text: `Employee #${id} deleted.` });
        setTimeout(() => this.deleteMsg.set(null), 3000);
      },
      error: err => {
        this.isDeleting.set(false);
        this.pendingDeleteId.set(null);
        this.deleteMsg.set({ ok: false, text: err.message ?? 'Delete failed.' });
      }
    });
  }

  /** trackBy keeps the DOM stable when the array is updated */
  trackById(_i: number, e: Employee): number { return e.id!; }

  /** Helper used in the template: (input)="searchTerm.set(getVal($event))" */
  getVal(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
