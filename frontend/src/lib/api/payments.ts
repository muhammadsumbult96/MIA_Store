import { apiClient } from "./client";

export interface PaymentRequest {
  order_number: string;
  return_url: string;
}

export interface PaymentResponse {
  payment_url: string;
}

export interface PaymentCallbackResponse {
  success: boolean;
  order_number?: string;
  message: string;
}

export const paymentsApi = {
  createPayment: async (data: PaymentRequest): Promise<PaymentResponse> => {
    return apiClient.post<PaymentResponse>("/payments/create", data);
  },
};

