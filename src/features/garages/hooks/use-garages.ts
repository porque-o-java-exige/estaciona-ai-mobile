import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { garageService } from '../services/garage.service';
import { GarageRequest, GarageResponse } from '../types/garage.types';

export function useOwnerGarages() {
  return useQuery<GarageResponse[]>({
    queryKey: ['owner-garages'],
    queryFn: garageService.getOwnerGarages,
  });
}

export function useCreateGarage() {
  const queryClient = useQueryClient();

  return useMutation<GarageResponse, unknown, GarageRequest>({
    mutationFn: garageService.createGarage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['owner-garages'] });
      void queryClient.invalidateQueries({ queryKey: ['garages'] });
    },
  });
}

export function useUpdateGarage() {
  const queryClient = useQueryClient();

  return useMutation<
    GarageResponse,
    unknown,
    { garageId: string; payload: GarageRequest }
  >({
    mutationFn: ({ garageId, payload }) =>
      garageService.updateGarage(garageId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['owner-garages'] });
      void queryClient.invalidateQueries({ queryKey: ['garages'] });
    },
  });
}

export function useDeleteGarage() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: garageService.deleteGarage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['owner-garages'] });
      void queryClient.invalidateQueries({ queryKey: ['garages'] });
    },
  });
}