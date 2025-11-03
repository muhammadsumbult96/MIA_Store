import { apiClient } from "./client";

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: string;
  total_price: string;
}

export interface ShippingInfo {
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code?: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code?: string;
  subtotal: string;
  shipping_fee: string;
  total: string;
  notes?: string;
  created_at: string;
  items: OrderItem[];
}

export interface CreateOrderRequest {
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  shipping_info: ShippingInfo;
  notes?: string;
}

export interface OrderListResponse {
  items: Order[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const ordersApi = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    return apiClient.post<Order>("/orders", data);
  },

  getOrders: async (page = 1, pageSize = 20): Promise<OrderListResponse> => {
    return apiClient.get<OrderListResponse>(`/orders?page=${page}&page_size=${pageSize}`);
  },

  getOrder: async (id: number): Promise<Order> => {
    return apiClient.get<Order>(`/orders/${id}`);
  },

  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    return apiClient.get<Order>(`/orders/number/${orderNumber}`);
  },
};

