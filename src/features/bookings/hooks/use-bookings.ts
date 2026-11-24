import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/booking.service';
import {
  BookingResponse,
  CreateBookingRequest,
  DriverVehicle,
} from '../types/booking.types';

export function useMyBookings() {
  return useQuery<BookingResponse[]>({
    queryKey: ['my-bookings'],
    queryFn: bookingService.getMyBookings,
  });
}

export function useMyVehicles() {
  return useQuery<DriverVehicle[]>({
    queryKey: ['my-vehicles'],
    queryFn: bookingService.getMyVehicles,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation<BookingResponse, unknown, CreateBookingRequest>({
    mutationFn: bookingService.createBooking,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      void queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation<BookingResponse, unknown, string>({
    mutationFn: bookingService.cancelBooking,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
}