import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import 'zone.js'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
        // Use zone-based change detection (coalesce events for performance)
     provideZonelessChangeDetection(), 

    // HTTP client backed by the Fetch API
    provideHttpClient(withFetch()),

    provideRouter(routes)
  ]
};
