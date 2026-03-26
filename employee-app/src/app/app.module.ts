/**
 * app.module.ts
 *
 * Root NgModule – the entry point that wires all pieces of the app together.
 *
 * Key imports:
 *   BrowserModule     – Required for any browser-based Angular app
 *   HttpClientModule  – Enables Angular's HttpClient (used in EmployeeService)
 *   ReactiveFormsModule – Enables reactive forms (FormBuilder, FormGroup, etc.)
 *
 * All components must be declared here so Angular's compiler knows about them.
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';

@NgModule({
  declarations: [
    AppComponent,           // Root shell component
    EmployeeListComponent,  // Table + delete/edit buttons
    EmployeeFormComponent   // Create / edit form
  ],
  imports: [
    BrowserModule,          // Core browser APIs (ngIf, ngFor, etc.)
    HttpClientModule,       // HTTP support for EmployeeService
    ReactiveFormsModule     // Reactive forms support for EmployeeFormComponent
  ],
  bootstrap: [AppComponent] // Angular starts the app by rendering AppComponent
})
export class AppModule {}
