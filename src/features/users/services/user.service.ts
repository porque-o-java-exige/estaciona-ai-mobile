import { api } from '@/lib/axios';
import { CreateUserRequest, UserResponse } from '../types/user.types';

export const userService = {
  async create(payload: CreateUserRequest): Promise<UserResponse> {
    const { data } = await api.post<UserResponse>('/users', payload);
    return data;
  },
};