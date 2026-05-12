// src/app/components/auth/login/login.component.ts
//
// Signal patterns:
//   signal()   — username, password, isPending, serverError, submitted
//   computed() — usernameError, passwordError, isValid

import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  private readonly router = inject(Router);
  readonly auth           = inject(AuthService);

  //  Form field signals 
  readonly username    = signal('');
  readonly password    = signal('');

  //  UI state signals 
  readonly isPending   = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly submitted   = signal(false);

  //  Computed validation signals 
  readonly usernameError = computed(() => {
    if (!this.submitted()) return null;
    return this.username().trim() ? null : 'Username is required.';
  });

  readonly passwordError = computed(() => {
    if (!this.submitted()) return null;
    return this.password() ? null : 'Password is required.';
  });

  readonly isValid = computed(() =>
    !this.usernameError() && !this.passwordError()
  );

  submit(): void {
    this.submitted.set(true);
    if (!this.isValid()) return;

    this.isPending.set(true);
    this.serverError.set(null);

    this.auth.login({
      username: this.username().trim(),
      password: this.password()
    }).subscribe({
      next: () => {
        this.isPending.set(false);
        this.router.navigate(['/home']);
      },
      error: err => {
        this.isPending.set(false);
        this.serverError.set(
          err?.error?.message ?? 'Invalid username or password.'
        );
      }
    });
  }

  str(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
