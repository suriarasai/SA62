import { Component, OnInit, output, signal, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './employee-list.html',
})
export class EmployeeList implements OnInit {

  //  Signals 
  readonly employees = signal<Employee[]>([]);
  readonly message   = signal<string>('');
  readonly isSuccess = signal<boolean>(true);
  readonly isLoading = signal<boolean>(false);

  //  Output (Angular 21 signal-based output) 
  /**
   * Emits the employee to edit (or null for "create new") to AppComponent.
   * Replaces the old @Output() editEmployee = new EventEmitter<Employee | null>().
   */
  readonly editEmployee = output<Employee | null>();

  //  DI via inject() 
  private readonly employeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.loadEmployees();
  }

loadEmployees(): void {
  this.isLoading.set(true);   
  this.employeeService.getAllEmployees().subscribe({
    next: (data: Employee[]) => {
      this.employees.set(data);
      this.isLoading.set(false);  
      this.message.set('');
    },
    error: () => {
      this.isLoading.set(false);
      this.showMessage('Failed to load employees. Is the backend running?', false);
    },
  });
}

  onEdit(employee: Employee): void {
    this.editEmployee.emit(employee);
  }

  onAddNew(): void {
    this.editEmployee.emit(null);
  }

  onDelete(id: number | undefined): void {
    if (!id) return;
    if (!confirm(`Are you sure you want to delete employee ID ${id}?`)) return;

    this.employeeService.deleteEmployee(id).subscribe({
      next: (msg:string) => {
        // Remove from local signal array without re-fetching
        this.employees.update((list: Employee[]) => list.filter((e: Employee) => e.id !== id));
        this.showMessage(msg, true);
      },
      error: () => this.showMessage('Delete failed. Employee may not exist.', false),
    });
  }

  private showMessage(text: string, success: boolean): void {
    this.message.set(text);
    this.isSuccess.set(success);
      // Only auto-clear success messages, leave errors visible
  if (success) {
    setTimeout(() => this.message.set(''), 4000);
  }
  }
}

