export interface CreateReviewRequest {
  bookingId: string;
  rating: number;
  comment: string;
}

export interface GarageReviewResponse {
  id: string;
  bookingId: string;
  garageId: string;
  driverName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DriverReviewResponse {
  id: string;
  bookingId: string;
  driverId: string;
  ownerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}