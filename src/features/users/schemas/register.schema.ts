import { z } from 'zod';
import { onlyDigits } from '@/utils/formatters';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Informe seu nome completo.'),
  email: z
    .string()
    .trim()
    .min(1, 'Informe seu e-mail.')
    .email('Digite um e-mail válido.'),
  password: z
    .string()
    .min(8, 'Use pelo menos 8 caracteres.')
    .max(18, 'A senha deve ter no máximo 18 caracteres.'),
  phoneNumber: z
    .string()
    .min(1, 'Informe seu celular.')
    .refine((val) => {
      const digits = onlyDigits(val);
      return digits.length >= 10 && digits.length <= 13;
    }, 'Digite um celular válido com DDD.'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;