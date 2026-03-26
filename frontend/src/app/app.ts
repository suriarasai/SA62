import { Component, signal, viewChild } from '@angular/core';
import { Employee } from './models/employee.model';
import { EmployeeList } from './components/employee-list/employee-list';
import { EmployeeForm } from './components/employee-form/employee-form';

@Component({
  selector: 'app-root',
  standalone: true,
  // Standalone components are imported here instead of declared in a module
  imports: [EmployeeList, EmployeeForm],
  templateUrl: './app.html',
})
export class App {

  //  Signals 
  readonly showForm         = signal<boolean>(false);
  readonly selectedEmployee = signal<Employee | null>(null);

  /**
   * viewChild() returns a Signal<EmployeeListComponent | undefined>.
   * Replaces @ViewChild(EmployeeListComponent) listComponent!: EmployeeListComponent.
   */
  private readonly listComponent = viewChild(EmployeeList);

  //  Event handlers 

  onShowForm(employee: Employee | null): void {
    this.selectedEmployee.set(employee);
    this.showForm.set(true);
  }

  onSaved(): void {
    this.showForm.set(false);
    // Small timeout lets Angular re-render the list before refreshing data
    setTimeout(() => this.listComponent()?.loadEmployees(), 0);
  }

  onCancelled(): void {
    this.showForm.set(false);
  }
}
