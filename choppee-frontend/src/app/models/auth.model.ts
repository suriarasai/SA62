// src/app/models/auth.model.ts

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
}
