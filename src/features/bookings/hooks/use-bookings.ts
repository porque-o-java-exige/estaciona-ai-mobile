import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { garageService } from '@/features/garages/services/garage.service';
import { GarageDetail } from '@/features/garages/types/garage.types';
import {
  bookingService,
  CreateVehicleRequest,
} from '../services/booking.service';
import {
  BookingResponse,
  CreateBookingRequest,
  DriverVehicle,
} from '../types/booking.types';

export interface EnrichedBooking extends BookingResponse {
  garage?: GarageDetail;
}

export function useMyBookings() {
  return useQuery<BookingResponse[]>({
    queryKey: ['my-bookings'],
    queryFn: bookingService.getMyBookings,
  });
}

export function useEnrichedBookings() {
  const bookingsQuery = useMyBookings();
  const bookings = bookingsQuery.data ?? [];

  const uniqueGarageIds = Array.from(
    new Set(bookings.map((b) => b.garageId).filter(Boolean))
  );

  const garageQueries = useQueries({
    queries: uniqueGarageIds.map((garageId) => ({
      queryKey: ['garage-detail', garageId],
      queryFn: () => garageService.getGarageById(garageId),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const garageMap = new Map<string, GarageDetail>();
  uniqueGarageIds.forEach((id, index) => {
    const detail = garageQueries[index]?.data;
    if (detail) {
      garageMap.set(id, detail);
    }
  });

  const enrichedData: EnrichedBooking[] = bookings.map((booking) => ({
    ...booking,
    garage: garageMap.get(booking.garageId),
  }));

  return {
    ...bookingsQuery,
    data: enrichedData,
  };
}

export function useMyVehicles() {
  return useQuery<DriverVehicle[]>({
    queryKey: ['my-vehicles'],
    queryFn: bookingService.getMyVehicles,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation<DriverVehicle, unknown, CreateVehicleRequest>({
    mutationFn: bookingService.createVehicle,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
    },
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