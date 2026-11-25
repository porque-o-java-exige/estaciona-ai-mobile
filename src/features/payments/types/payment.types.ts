export type PaymentMethod = 'PIX';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface CreatePaymentRequest {
  bookingId: string;
  paymentMethod: PaymentMethod;
  payerEmail: string;
  payerCpf: string;
  cardToken?: string;
}

export interface PaymentResponse {
  id: string;
  bookingId: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  totalAmount: number;
  platformFee: number;
  ownerNetAmount: number;
  mpPaymentId: string;
  qrCode: string;
  qrCodeBase64: string | null;
  createdAt: string;
  updatedAt: string;
}