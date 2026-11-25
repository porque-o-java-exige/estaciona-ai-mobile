import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../services/payment.service';
import { CreatePaymentRequest, PaymentResponse } from '../types/payment.types';

export function useCreatePayment() {
  return useMutation<PaymentResponse, unknown, CreatePaymentRequest>({
    mutationFn: paymentService.createPayment,
  });
}

export function useSimulatePaymentApproval() {
  const queryClient = useQueryClient();

  return useMutation<PaymentResponse, unknown, string>({
    mutationFn: paymentService.simulateApproval,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}