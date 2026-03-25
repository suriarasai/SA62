/**
 * main.ts
 *
 * Angular application bootstrap entry point.
 * Compiled by Angular CLI and injected into index.html at build time.
 *
 * platformBrowserDynamic() bootstraps the app in the browser using JIT
 * (or AOT when built with ng build --configuration production).
 */

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
