/**
 * app.component.ts
 *
 * Root component – the application shell.
 *
 * Acts as a simple view router between two states using a flag:
 *   showForm = false  → displays <app-employee-list>
 *   showForm = true   → displays <app-employee-form>
 *
 * This avoids the complexity of Angular Router for a single-page CRUD app.
 *
 * Event flow:
 *   EmployeeListComponent emits editEmployee(emp|null)
 *     → AppComponent sets selectedEmployee and shows the form
 *   EmployeeFormComponent emits saved or cancelled
 *     → AppComponent hides the form and instructs the list to reload
 */

import { Component, ViewChild } from '@angular/core';
import { Employee } from './models/employee.model';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';

@Component({
  selector: 'app-root',           // Matches <app-root> in index.html
  templateUrl: './app.component.html'
})
export class AppComponent {

  /**
   * Controls which child component is visible.
   *   false → employee list view (default on load)
   *   true  → employee form view
   */
  showForm: boolean = false;

  /**
   * The employee to pre-fill the form with.
   *   null      → form should open blank (create mode)
   *   Employee  → form should pre-fill with this data (edit mode)
   */
  selectedEmployee: Employee | null = null;

  /**
   * @ViewChild gives direct access to the list component instance
   * so we can call loadEmployees() on it after a save, without destroying it.
   */
  @ViewChild(EmployeeListComponent) listComponent!: EmployeeListComponent;

  /**
   * Called when EmployeeListComponent emits editEmployee.
   * Switches view to the form; passes employee (or null) to it.
   * @param employee - Employee to edit, or null for create mode
   */
  onShowForm(employee: Employee | null): void {
    this.selectedEmployee = employee;
    this.showForm = true;
  }

  /**
   * Called when EmployeeFormComponent emits the saved event.
   * Hides the form, returns to the list, and refreshes the data.
   */
  onSaved(): void {
    this.showForm = false;
    // Small timeout lets Angular re-render the list before loading data
    setTimeout(() => this.listComponent?.loadEmployees(), 0);
  }

  /**
   * Called when EmployeeFormComponent emits the cancelled event.
   * Simply hides the form; no data refresh needed.
   */
  onCancelled(): void {
    this.showForm = false;
  }
}
