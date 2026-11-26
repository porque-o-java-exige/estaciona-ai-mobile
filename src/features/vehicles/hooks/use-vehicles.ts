import { Alert } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { vehicleService } from '../services/vehicle.service';
import { VehicleRequest, VehicleResponse } from '../types/vehicle.types';

function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { message?: string; error?: string }
      | string
      | undefined;
    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object' && data.message) return data.message;
  }
  return fallback;
}

export function useMyVehicles() {
  return useQuery<VehicleResponse[]>({
    queryKey: ['my-vehicles'],
    queryFn: vehicleService.getMyVehicles,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation<VehicleResponse, unknown, VehicleRequest>({
    mutationFn: vehicleService.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation<
    VehicleResponse,
    unknown,
    { vehicleId: string; payload: VehicleRequest }
  >({
    mutationFn: ({ vehicleId, payload }) =>
      vehicleService.update(vehicleId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: vehicleService.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
    },
    onError: (error) => {
      const msg = extractApiErrorMessage(
        error,
        'Não foi possível remover este veículo. Verifique se ele não está vinculado a uma reserva ativa ou anterior.'
      );
      Alert.alert('Erro ao excluir veículo', msg);
    },
  });
}