import axios from 'axios';
import { env } from '@/config/env';
import { tokenStorage } from '@/storage/token-storage';

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

function extractNativeReason(request: unknown): string {
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

api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (__DEV__) {
    console.log(
      `[API Request] ${config.method?.toUpperCase()} ${config.baseURL ?? ''}${config.url ?? ''}`,
      config.data
    );
  }

  return config;
});

if (__DEV__) {
  api.interceptors.response.use(
    (response) => {
      console.log(
        `[API Response] ${response.status} ${response.config.url ?? ''}`,
        response.data
      );
      return response;
    },
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        console.log('[API Error]', {
          url: `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`,
          code: error.code,
          status: error.response?.status,
          nativeReason: extractNativeReason(error.request),
          data: error.response?.data,
        });
      }
      return Promise.reject(error);
    }
  );
}