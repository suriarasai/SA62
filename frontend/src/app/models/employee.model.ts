// src/app/models/employee.model.ts

export interface Employee {
  id?:         number;
  name:        string;
  department:  string;
  salary:      number;
  designation: string;
}

export const DEPARTMENTS: string[] = [
  'NUS-ISS',
  'Engineering',
  'Finance',
  'Human Resources',
  'Marketing',
  'Operations',
];

export const DESIGNATIONS: string[] = [
  'Engineer',
  'Senior Engineer',
  'Manager',
  'Senior Manager',
  'Director',
  'VP',
  'CEO',
  'HR',
  'Analyst',
];
