export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  password?: string;
  phoneNumber: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  photoUrl?: string | null;
}

export interface PublicUserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  photoUrl?: string | null;
}

export interface DriverRatingSummary {
  driverId: string;
  averageRating: number;
  totalReviews: number;
}