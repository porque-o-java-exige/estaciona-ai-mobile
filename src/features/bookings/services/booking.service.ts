import { api } from '@/lib/axios';
import {
  BookingResponse,
  CreateBookingRequest,
  DriverVehicle,
} from '../types/booking.types';

export interface CreateVehicleRequest {
  model: string;
  plate: string;
  brand?: string;
  color?: string;
}

export const bookingService = {
  async getMyBookings(): Promise<BookingResponse[]> {
    const { data } = await api.get<BookingResponse[]>('/bookings');
    return data;
  },

  async createBooking(payload: CreateBookingRequest): Promise<BookingResponse> {
    const { data } = await api.post<BookingResponse>('/bookings', payload);
    return data;
  },

  async cancelBooking(bookingId: string): Promise<BookingResponse> {
    const { data } = await api.patch<BookingResponse>(
      `/bookings/${bookingId}/cancel`
    );
    return data;
  },

  async getMyVehicles(): Promise<DriverVehicle[]> {
    try {
      const { data } = await api.get<DriverVehicle[]>('/vehicles');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async createVehicle(payload: CreateVehicleRequest): Promise<DriverVehicle> {
    const { data } = await api.post<DriverVehicle>('/vehicles', payload);
    return data;
  },
};