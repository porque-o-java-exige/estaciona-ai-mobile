import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { onlyDigits } from '@/utils/formatters';
import { RegisterFormData } from '../schemas/register.schema';
import { userService } from '../services/user.service';
import { UserResponse } from '../types/user.types';

interface ApiErrorResponse {
  message?: string;
}

function getNativeNetworkReason(request: unknown): string {
  if (
    typeof request === 'object' &&
    request !== null &&
    '_response' in request &&
    typeof (request as { _response: unknown })._response === 'string'
  ) {
    return (request as { _response: string })._response;
  }
  return '';
}

export function getRegisterErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const apiMessage = (error.response?.data as ApiErrorResponse | undefined)?.message;

    if (status === 409) {
      return 'Este e-mail já está cadastrado no EstacionaAI.';
    }
    if (status === 400) {
      return apiMessage || 'Verifique os dados informados e tente novamente.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'Tempo limite excedido ao aguardar resposta do servidor.';
    }
    if (!error.response) {
      const targetUrl = `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`;
      const nativeReason = getNativeNetworkReason(error.request);

      if (__DEV__) {
        return `Falha de rede ao acessar:\n${targetUrl}\n\nMotivo: ${nativeReason || error.message}`;
      }
      return 'Não foi possível conectar ao servidor. Tente novamente.';
    }
  }

  return 'Não foi possível concluir o cadastro agora. Tente novamente.';
}

export function useRegisterUser() {
  return useMutation<UserResponse, unknown, RegisterFormData>({
    mutationFn: async (formData) => {
      const digits = onlyDigits(formData.phoneNumber);
      const cleanPhone =
        digits.startsWith('55') && digits.length > 11
          ? digits.slice(2)
          : digits;

      return userService.create({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phoneNumber: cleanPhone,
      });
    },
  });
}