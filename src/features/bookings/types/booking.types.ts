export type BookingType = 'HOURLY' | 'DAILY';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ACTIVE'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CreateBookingRequest {
  garageId: string;
  vehicleId: string;
  bookingType: BookingType;
  startDateTime: string;
  endDateTime: string;
}

export interface BookingResponse {
  bookingId: string;
  driverId: string;
  garageId: string;
  vehicleId: string;
  startDateTime: string;
  endDateTime: string;
  totalAmount: number;
  bookingType: BookingType;
  status: BookingStatus;
  createdAt: string;
}

export interface DriverVehicle {
  vehicleId?: string;
  id?: string;
  model: string;
  plate: string;
  brand?: string;
  color?: string;
}