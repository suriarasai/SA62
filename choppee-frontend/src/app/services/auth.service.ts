// src/app/services/auth.service.ts
//
// Signal patterns:
//   signal()   — currentUser, token (writable state)
//   computed() — isLoggedIn, username (derived state)

import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, throwError } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

const TOKEN_KEY = 'choppee_token';
const USER_KEY  = 'choppee_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly http      = inject(HttpClient);
  private readonly router    = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  //  Writable signals — persisted to localStorage 

  readonly token       = signal<string | null>(
    this.isBrowser ? localStorage.getItem(TOKEN_KEY) : null
  );
  readonly currentUser = signal<AuthResponse | null>(
    this.isBrowser
      ? JSON.parse(localStorage.getItem(USER_KEY) ?? 'null')
      : null
  );

  //  Computed signals 

  /** True when a valid token is held in memory */
  readonly isLoggedIn = computed(() => !!this.token());

  /** Display name of the logged-in user */
  readonly username   = computed(() => this.currentUser()?.username ?? '');

  // POST /api/auth/login 
  login(req: LoginRequest) {
    return this.http.post<AuthResponse>('/api/auth/login', req).pipe(
      tap(res => this._persist(res)),
      catchError(err => throwError(() => err))
    );
  }

  // POST /api/auth/register 
  register(req: RegisterRequest) {
    return this.http.post<AuthResponse>('/api/auth/register', req).pipe(
      tap(res => this._persist(res)),
      catchError(err => throwError(() => err))
    );
  }

  logout(): void {
    this.token.set(null);
    this.currentUser.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    this.router.navigate(['/login']);
  }

  /** Returns the Authorization header value for HTTP requests */
  getAuthHeader(): string {
    return `Bearer ${this.token()}`;
  }

  private _persist(res: AuthResponse): void {
    this.token.set(res.token);
    this.currentUser.set(res);
    if (this.isBrowser) {
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res));
    }
  }
}
