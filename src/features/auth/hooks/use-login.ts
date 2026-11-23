import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useAuthStore } from '@/stores/use-auth-store';
import { LoginFormData } from '../schemas/login.schema';
import { authService } from '../services/auth.service';
import { LoginResponse } from '../types/auth.types';

interface ApiErrorResponse {
  message?: string;
}

export function getLoginErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const apiMessage = (error.response?.data as ApiErrorResponse | undefined)?.message;

    if (status === 401) {
      return 'E-mail ou senha inválidos.';
    }
    if (status === 400) {
      return apiMessage || 'Verifique os dados informados e tente novamente.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Tempo limite excedido ao aguardar resposta do servidor.';
    }
    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Verifique sua internet.';
    }
  }

  return 'Não foi possível realizar o login agora. Tente novamente.';
}

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation<LoginResponse, unknown, LoginFormData>({
    mutationFn: async (formData) => {
      const response = await authService.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      await setSession(response);
      return response;
    },
  });
}