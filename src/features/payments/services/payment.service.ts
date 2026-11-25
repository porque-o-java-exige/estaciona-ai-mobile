import { api } from '@/lib/axios';
import { CreatePaymentRequest, PaymentResponse } from '../types/payment.types';

export const paymentService = {
  async createPayment(payload: CreatePaymentRequest): Promise<PaymentResponse> {
    const { data } = await api.post<PaymentResponse>('/payments', payload);
    return data;
  },

  async simulateApproval(paymentId: string): Promise<PaymentResponse> {
    const { data } = await api.post<PaymentResponse>(
      `/payments/${paymentId}/simulate-approval`
    );
    return data;
  },
};