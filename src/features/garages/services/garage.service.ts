import { api } from '@/lib/axios';
import {
  GarageDetail,
  GarageNearbyItem,
  GarageRating,
  NearbyGaragesParams,
  PageResponse,
} from '../types/garage.types';

export const garageService = {
  async getNearbyGarages({
    lat,
    lng,
    radius = 2,
    page = 0,
    size = 50,
  }: NearbyGaragesParams): Promise<GarageNearbyItem[]> {
    const { data } = await api.get<PageResponse<GarageNearbyItem>>(
      '/garages/nearby',
      {
        params: { lat, lng, radius, page, size },
      }
    );

    return data.content ?? [];
  },

  async getGarageById(id: string): Promise<GarageDetail> {
    const { data } = await api.get<GarageDetail>(`/garages/${id}`);
    return data;
  },

  async getGarageRating(garageId: string): Promise<GarageRating> {
    const { data } = await api.get<GarageRating>(`/garages/${garageId}/rating`);
    return data;
  },
};