import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './services/jwt-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // withComponentInputBinding lets :id route params flow into input() signals
    provideRouter(routes, withComponentInputBinding()),

    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor])),
  ],
};
