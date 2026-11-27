import { api } from '@/lib/axios';
import {
  GarageDetail,
  GarageNearbyItem,
  GarageRating,
  GarageRequest,
  GarageResponse,
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

  async getOwnerGarages(): Promise<GarageResponse[]> {
    const { data } = await api.get<GarageResponse[]>('/garages/owner');
    return Array.isArray(data) ? data : [];
  },

  async createGarage(payload: GarageRequest): Promise<GarageResponse> {
    const { data } = await api.post<GarageResponse>('/garages', payload);
    return data;
  },

  async updateGarage(
    garageId: string,
    payload: GarageRequest
  ): Promise<GarageResponse> {
    const { data } = await api.put<GarageResponse>(
      `/garages/${garageId}`,
      payload
    );
    return data;
  },

  async deleteGarage(garageId: string): Promise<void> {
    await api.delete(`/garages/${garageId}`);
  },

  async uploadGarageImage(
    fileUri: string,
    mimeType = 'image/jpeg'
  ): Promise<string> {
    const normalizedUri =
      !fileUri.startsWith('file://') && !fileUri.startsWith('content://')
        ? `file://${fileUri}`
        : fileUri;

    const filename =
      normalizedUri.split('/').pop() || `garage-${Date.now()}.jpg`;

    const formData = new FormData();
    formData.append('file', {
      uri: normalizedUri,
      name: filename,
      type: mimeType,
    } as unknown as Blob);

    const { data } = await api.post<{
      url?: string;
      imageUrl?: string;
      coverImageUrl?: string;
    }>('/storage/upload?folder=garages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (body) => body,
    });

    const uploadedUrl = data.url || data.imageUrl || data.coverImageUrl;
    if (!uploadedUrl) {
      throw new Error('URL da imagem não retornada pelo servidor');
    }

    return uploadedUrl;
  },
};