export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  photoUrl: string | null;
  roles: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_OWNER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface PublicUserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  photoUrl?: string | null;
}