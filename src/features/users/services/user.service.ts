import { api } from '@/lib/axios';
import {
  CreateUserRequest,
  DriverRatingSummary,
  PublicUserProfile,
  UpdateUserRequest,
  UserResponse,
} from '../types/user.types';

export const userService = {
  async create(payload: CreateUserRequest): Promise<UserResponse> {
    const { data } = await api.post<UserResponse>('/users', payload);
    return data;
  },

  async getUserById(userId: string): Promise<PublicUserProfile> {
    const { data } = await api.get<PublicUserProfile>(`/users/${userId}`);
    return data;
  },

  async update(
    userId: string,
    payload: UpdateUserRequest
  ): Promise<UserResponse> {
    const { data } = await api.put<UserResponse>(`/users/${userId}`, payload);
    return data;
  },

  async updatePhoto(
    userId: string,
    fileUri: string,
    mimeType = 'image/jpeg'
  ): Promise<UserResponse> {
    const formData = new FormData();
    const filename = fileUri.split('/').pop() || `avatar-${Date.now()}.jpg`;

    formData.append('file', {
      uri: fileUri,
      name: filename,
      type: mimeType,
    } as unknown as Blob);

    const { data } = await api.patch<UserResponse>(
      `/users/${userId}/photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },

  async delete(userId: string): Promise<void> {
    await api.delete(`/users/${userId}`);
  },

  async getDriverRating(driverId: string): Promise<DriverRatingSummary> {
    const { data } = await api.get<DriverRatingSummary>(
      `/drivers/${driverId}/rating`
    );
    return data;
  },
};