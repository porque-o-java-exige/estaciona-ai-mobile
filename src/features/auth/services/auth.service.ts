import { api } from '@/lib/axios';
import { LoginRequest, LoginResponse } from '../types/auth.types';

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};