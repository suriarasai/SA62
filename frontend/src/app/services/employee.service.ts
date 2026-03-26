// src/app/services/employee.service.ts

import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../models/employee.model';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {

  private readonly http    = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/employees';

  //  Writable signals 
  readonly employees = signal<Employee[]>([]);
  readonly isLoading = signal(false);
  readonly error     = signal<string | null>(null);

  //  Computed signals 
  readonly total     = computed(() => this.employees().length);
  readonly avgSalary = computed(() => {
    const list = this.employees();
    if (!list.length) return 0;
    return list.reduce((s, e) => s + e.salary, 0) / list.length;
  });

  //  GET all 
  loadAll(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.http.get<Employee[]>(this.baseUrl).pipe(
      tap(data => { this.employees.set(data); this.isLoading.set(false); }),
      catchError(err => { this.isLoading.set(false);
                          this.error.set(err.message ?? 'Load failed');
                          return throwError(() => err); })
    ).subscribe();
  }

  //  GET by id 
  getById(id: number) {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  //  POST 
  create(emp: Employee) {
    return this.http.post<Employee>(this.baseUrl, emp).pipe(
      tap(created => this.employees.update(list => [...list, created]))
    );
  }

  //  PUT 
  update(id: number, emp: Employee) {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, emp).pipe(
      tap(updated =>
        this.employees.update(list =>
          list.map(e => (e.id === id ? updated : e))
        )
      )
    );
  }

  //  DELETE 
  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' }).pipe(
      tap(() =>
        this.employees.update(list => list.filter(e => e.id !== id))
      )
    );
  }
}
