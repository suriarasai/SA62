// src/app/components/auth/register/register.component.ts
//
// Signal patterns:
//   signal()   — form fields, UI state
//   computed() — per-field validation, isValid, pageTitle

import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  private readonly router = inject(Router);
  readonly auth           = inject(AuthService);

  //  Form field signals 
  readonly username  = signal('');
  readonly email     = signal('');
  readonly password  = signal('');
  readonly firstName = signal('');
  readonly lastName  = signal('');
  readonly birthDate = signal('');

  //  UI state signals 
  readonly isPending   = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly submitted   = signal(false);
  readonly success     = signal(false);

  //  Computed validation signals 

  readonly usernameError = computed(() => {
    if (!this.submitted()) return null;
    const v = this.username().trim();
    if (!v) return 'Username is required.';
    if (v.length < 3) return 'Username must be at least 3 characters.';
    return null;
  });

  readonly emailError = computed(() => {
    if (!this.submitted()) return null;
    const v = this.email().trim();
    if (!v) return 'Email is required.';
    if (!v.includes('@')) return 'Enter a valid email address.';
    return null;
  });

  readonly passwordError = computed(() => {
    if (!this.submitted()) return null;
    const v = this.password();
    if (!v) return 'Password is required.';
    if (v.length < 6) return 'Password must be at least 6 characters.';
    return null;
  });

  readonly firstNameError = computed(() => {
    if (!this.submitted()) return null;
    return this.firstName().trim() ? null : 'First name is required.';
  });

  readonly lastNameError = computed(() => {
    if (!this.submitted()) return null;
    return this.lastName().trim() ? null : 'Last name is required.';
  });

  readonly isValid = computed(() =>
    !this.usernameError() &&
    !this.emailError() &&
    !this.passwordError() &&
    !this.firstNameError() &&
    !this.lastNameError()
  );

  submit(): void {
    this.submitted.set(true);
    if (!this.isValid()) return;

    this.isPending.set(true);
    this.serverError.set(null);

    this.auth.register({
      username:  this.username().trim(),
      email:     this.email().trim(),
      password:  this.password(),
      firstName: this.firstName().trim(),
      lastName:  this.lastName().trim(),
      birthDate: this.birthDate() || undefined
    }).subscribe({
      next: () => {
        this.isPending.set(false);
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/home']), 1500);
      },
      error: err => {
        this.isPending.set(false);
        this.serverError.set(
          err?.error?.message ?? 'Registration failed. Please try again.'
        );
      }
    });
  }

  str(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
