import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'   // Singleton: one instance shared across the whole app
})
export class EmployeeService {
   private readonly API_URL = 'http://localhost:8080/api/employees';
   constructor(private http: HttpClient) {}
   getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.API_URL);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.API_URL}/${id}`);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.API_URL, employee);
  }

  updateEmployee(id: number, employee: Employee): 
                      Observable<Employee> {
    return this.http.put<Employee>(`${this.API_URL}/${id}`, 
               employee);
  }
  deleteEmployee(id: number): Observable<string> {
    
    return this.http.delete(`${this.API_URL}/${id}`, 
               { responseType: 'text' });
  }
}



