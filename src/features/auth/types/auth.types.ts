export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  userId: string;
  name: string;
  email: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}