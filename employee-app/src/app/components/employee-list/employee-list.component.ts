/**
 * employee-list.component.ts
 *
 * Displays all employees in a table with Edit and Delete action buttons.
 * Also acts as the hub for navigating to the create/edit form.
 *
 * Responsibilities:
 *  - Load all employees from the backend on init (ngOnInit)
 *  - Emit selection events to the parent (AppComponent) for edit routing
 *  - Delete an employee after user confirmation and refresh the list
 *  - Display inline status messages for feedback (success / error)
 */

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',        // Used in app.component.html as <app-employee-list>
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {

  /** The array of employees fetched from the backend */
  employees: Employee[] = [];

  /** Feedback message shown below the table (success or error) */
  message: string = '';

  /** Controls message text colour: true = green (success), false = red (error) */
  isSuccess: boolean = true;

  /**
   * Output event emitter: notifies AppComponent to switch to the form view
   * and pre-populate it with this employee for editing.
   * Carries the Employee object to be edited (or null for "create new").
   */
  @Output() editEmployee = new EventEmitter<Employee | null>();

  constructor(private employeeService: EmployeeService) {}

  /**
   * Lifecycle hook: called once after the component is initialised.
   * Triggers the initial data load.
   */
  ngOnInit(): void {
    this.loadEmployees();
  }

  /**
   * Calls the service to fetch all employees and stores the result locally.
   * On error, displays a red message so the user knows the API is unreachable.
   */
  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;   // Populate the table rows
        this.message = '';       // Clear any previous message
      },
      error: () => {
        this.showMessage('Failed to load employees. Is the backend running?', false);
      }
    });
  }

  /**
   * Emits an event carrying the selected employee so AppComponent
   * can show the form pre-filled with that employee's data.
   * @param employee - The row the user clicked "Edit" on
   */
  onEdit(employee: Employee): void {
    this.editEmployee.emit(employee);
  }

  /**
   * Emits null to tell AppComponent to show the form in "create" mode (blank).
   */
  onAddNew(): void {
    this.editEmployee.emit(null);
  }

  /**
   * Confirms deletion with a browser dialog, then calls the DELETE endpoint.
   * On success, removes the row from the local array to avoid a full reload.
   * On error, shows a red message.
   * @param id - The id of the employee to delete
   */
  onDelete(id: number | undefined): void {
    if (!id) return;

    // Browser confirm dialog – prevents accidental deletion
    if (!confirm(`Are you sure you want to delete employee ID ${id}?`)) return;

    this.employeeService.deleteEmployee(id).subscribe({
      next: (msg) => {
        // Remove deleted employee from local array without re-fetching all
        this.employees = this.employees.filter(e => e.id !== id);
        this.showMessage(msg, true);
      },
      error: () => {
        this.showMessage('Delete failed. Employee may not exist.', false);
      }
    });
  }

  /**
   * Sets the message and colour flag, then auto-clears after 4 seconds.
   * @param text      - The message to display
   * @param isSuccess - true for green success, false for red error
   */
  private showMessage(text: string, isSuccess: boolean): void {
    this.message = text;
    this.isSuccess = isSuccess;
    setTimeout(() => this.message = '', 4000);
  }
}
