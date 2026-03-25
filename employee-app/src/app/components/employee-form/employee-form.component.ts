/**
 * employee-form.component.ts
 *
 * Handles both CREATE (POST) and UPDATE (PUT) operations via a single reactive form.
 * The mode is determined by whether an Employee object is passed in via @Input():
 *   - Input is null  → Create mode  (POST /api/employees)
 *   - Input has data → Edit mode    (PUT  /api/employees/:id)
 *
 * On success the component emits a "saved" event so AppComponent
 * can switch back to the list view and optionally refresh it.
 *
 * Validation mirrors backend constraints:
 *   name     → required  (@NotNull)
 *   salary   → min 5500  (@DecimalMin("5500.00"))
 */

import {
  Component, OnInit, OnChanges,
  Input, Output, EventEmitter, SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',         // Used in app.component.html as <app-employee-form>
  templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent implements OnInit, OnChanges {

  /**
   * Input from AppComponent.
   *   null       → Create mode (form starts blank)
   *   Employee   → Edit mode   (form pre-filled with this data)
   */
  @Input() employeeToEdit: Employee | null = null;

  /**
   * Output event: fired after a successful save (create or update).
   * AppComponent listens to this to navigate back to the list.
   */
  @Output() saved = new EventEmitter<void>();

  /**
   * Output event: fired when the user clicks Cancel.
   * AppComponent uses this to switch back to the list without saving.
   */
  @Output() cancelled = new EventEmitter<void>();

  /** The reactive form group bound to the template */
  employeeForm!: FormGroup;

  /** Convenience flag used in the template to show correct heading/button text */
  isEditMode: boolean = false;

  /** Feedback message displayed below the form buttons */
  message: string = '';
  isSuccess: boolean = true;

  constructor(
    private fb: FormBuilder,              // Angular FormBuilder for reactive forms
    private employeeService: EmployeeService
  ) {}

  /**
   * Lifecycle hook: initialise the reactive form with validators on first render.
   * Validators here mirror the Jakarta Validation annotations in Employee.java.
   */
ngOnInit(): void {
  this.buildForm();
  if (this.employeeToEdit) {
    this.isEditMode = true;      // ← ADD THIS LINE
    this.populateForm(this.employeeToEdit);
  }
}

  /**
   * Lifecycle hook: called whenever an @Input property changes.
   * Allows the form to re-populate when the parent switches the selected employee.
   * @param changes - Angular change detection record
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employeeToEdit'] && this.employeeForm) {
      const emp: Employee | null = changes['employeeToEdit'].currentValue;
      if (emp) {
        this.isEditMode = true;
        this.populateForm(emp);
      } else {
        this.isEditMode = false;
        this.employeeForm.reset();   // Clear form for create mode
      }
    }
  }

  /**
   * Builds the FormGroup.
   * Validators:
   *   name    → Validators.required        (matches @NotNull)
   *   salary  → min(5500)                  (matches @DecimalMin("5500.00"))
   */
  private buildForm(): void {
    this.employeeForm = this.fb.group({
      name:        ['', Validators.required],
      department:  [''],
      salary:      [null, [Validators.required, Validators.min(5500)]],
      designation: ['']
    });
  }

  /**
   * Fills the form controls with values from the provided Employee object.
   * Called when switching into edit mode.
   * @param emp - The employee whose data should pre-fill the form
   */
  private populateForm(emp: Employee): void {
    this.employeeForm.setValue({
      name:        emp.name,
      department:  emp.department,
      salary:      emp.salary,
      designation: emp.designation
    });
  }

  /**
   * Called when the form is submitted.
   * Guards against invalid state, then dispatches either POST or PUT.
   */
  onSubmit(): void {
    // Angular marks all controls as touched so validation messages appear
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    // Build the payload from form values
    const formValue = this.employeeForm.value;
    const payload: Employee = {
      name:        formValue.name,
      department:  formValue.department,
      salary:      formValue.salary,
      designation: formValue.designation
    };

    if (this.isEditMode && this.employeeToEdit?.id) {
      // PUT – update existing employee; include the id in the body per backend expectation
      payload.id = this.employeeToEdit.id;
      this.employeeService.updateEmployee(this.employeeToEdit.id, payload).subscribe({
        next: () => {
          this.showMessage('Employee updated successfully.', true);
          setTimeout(() => this.saved.emit(), 1000);   // Brief delay so user sees message
        },
        error: () => this.showMessage('Update failed. Check salary is ≥ 5500.', false)
      });
    } else {
      // POST – create new employee
      this.employeeService.createEmployee(payload).subscribe({
        next: () => {
          this.showMessage('Employee created successfully.', true);
          setTimeout(() => this.saved.emit(), 1000);
        },
        error: () => this.showMessage('Create failed. Name is required and salary must be ≥ 5500.', false)
      });
    }
  }

  /**
   * Called when the user clicks Cancel.
   * Emits the cancelled event so AppComponent switches back to the list.
   */
  onCancel(): void {
    this.cancelled.emit();
  }

  /**
   * Template helper: returns true if a control is invalid AND has been touched.
   * Used by the template to decide when to show field-level error messages.
   * @param controlName - The name of the FormControl to check
   */
  isInvalid(controlName: string): boolean {
    const control = this.employeeForm.get(controlName);
    return !!(control?.invalid && control.touched);
  }

  /** Sets the message text + colour, then auto-clears after 4 seconds */
  private showMessage(text: string, success: boolean): void {
    this.message = text;
    this.isSuccess = success;
    setTimeout(() => this.message = '', 4000);
  }
}
