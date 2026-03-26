import {
  Component, OnInit, inject,
  input, output, effect, signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './employee-form.html',
})
export class EmployeeForm implements OnInit {

  //  Signal input (replaces @Input()) 
  /**
   * null  → Create mode (blank form)
   * Employee → Edit mode (pre-populated form)
   */
  readonly employeeToEdit = input<Employee | null>(null);

  //  Signal outputs (replaces @Output() + EventEmitter) 
  readonly saved     = output<void>();
  readonly cancelled = output<void>();

  //  Reactive local state 
  readonly isEditMode = signal<boolean>(false);
  readonly message    = signal<string>('');
  readonly isSuccess  = signal<boolean>(true);

  //  DI via inject() 
  private readonly fb              = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);

  //  Reactive form 
  employeeForm!: FormGroup;

  constructor() {
    /**
     * effect() runs whenever the employeeToEdit signal changes.
     * Replaces ngOnChanges — no SimpleChanges boilerplate needed.
     * Angular requires effect() to be called inside an injection context
     * (constructor or field initialiser), so it goes here rather than ngOnInit.
     */
    effect(() => {
      const emp = this.employeeToEdit();
      if (!this.employeeForm) return; // Guard: form not yet built on first run

      if (emp) {
        this.isEditMode.set(true);
        this.populateForm(emp);
      } else {
        this.isEditMode.set(false);
        this.employeeForm.reset();
      }
    });
  }

  ngOnInit(): void {
    this.buildForm();
    // If input was already set before init (e.g. edit mode on first render), apply it now
    const emp = this.employeeToEdit();
    if (emp) {
      this.isEditMode.set(true);
      this.populateForm(emp);
    }
  }

  private buildForm(): void {
    this.employeeForm = this.fb.group({
      name:        ['', Validators.required],
      department:  [''],
      salary:      [null, [Validators.required, Validators.min(5500)]],
      designation: [''],
    });
  }

  private populateForm(emp: Employee): void {
    this.employeeForm.setValue({
      name:        emp.name,
      department:  emp.department,
      salary:      emp.salary,
      designation: emp.designation,
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formValue = this.employeeForm.value;
    const payload: Employee = {
      name:        formValue.name,
      department:  formValue.department,
      salary:      formValue.salary,
      designation: formValue.designation,
    };

    if (this.isEditMode() && this.employeeToEdit()?.id) {
      payload.id = this.employeeToEdit()!.id;
      this.employeeService.updateEmployee(payload.id!, payload).subscribe({
        next: () => {
          this.showMessage('Employee updated successfully.', true);
          setTimeout(() => this.saved.emit(), 1000);
        },
        error: () => this.showMessage('Update failed. Check salary is ≥ 5500.', false),
      });
    } else {
      this.employeeService.createEmployee(payload).subscribe({
        next: () => {
          this.showMessage('Employee created successfully.', true);
          setTimeout(() => this.saved.emit(), 1000);
        },
        error: () => this.showMessage('Create failed. Name is required and salary must be ≥ 5500.', false),
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  isInvalid(controlName: string): boolean {
    const control = this.employeeForm.get(controlName);
    return !!(control?.invalid && control.touched);
  }

  private showMessage(text: string, success: boolean): void {
    this.message.set(text);
    this.isSuccess.set(success);
    setTimeout(() => this.message.set(''), 4000);
  }
}

