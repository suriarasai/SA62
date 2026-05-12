// src/app/services/jwt-interceptor.service.ts
//
// HTTP interceptor that attaches the JWT Bearer token to all /api requests.

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  // Only attach token to /api requests when a token exists
  if (token && req.url.startsWith('/api')) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }
  return next(req);
};
