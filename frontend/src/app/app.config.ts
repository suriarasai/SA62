// src/app/app.config.ts

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,  // route params → input() signals
} from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    // withComponentInputBinding lets :id route params flow into input() signals
    provideRouter(routes, withComponentInputBinding()),

    provideHttpClient(withFetch()),
  ],
};
