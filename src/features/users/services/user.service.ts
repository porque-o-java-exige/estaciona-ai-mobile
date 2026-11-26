import { api } from '@/lib/axios';
import {
  CreateUserRequest,
  PublicUserProfile,
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
};