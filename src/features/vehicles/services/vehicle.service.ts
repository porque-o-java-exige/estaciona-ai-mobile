import { api } from '@/lib/axios';
import { VehicleRequest, VehicleResponse } from '../types/vehicle.types';

export const vehicleService = {
  async getMyVehicles(): Promise<VehicleResponse[]> {
    const { data } = await api.get<VehicleResponse[]>('/vehicles');
    return Array.isArray(data) ? data : [];
  },

  async create(payload: VehicleRequest): Promise<VehicleResponse> {
    const { data } = await api.post<VehicleResponse>('/vehicles', payload);
    return data;
  },

  async update(
    vehicleId: string,
    payload: VehicleRequest
  ): Promise<VehicleResponse> {
    const { data } = await api.put<VehicleResponse>(
      `/vehicles/${vehicleId}`,
      payload
    );
    return data;
  },

  async remove(vehicleId: string): Promise<void> {
    await api.delete(`/vehicles/${vehicleId}`);
  },
};