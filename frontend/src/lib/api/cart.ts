import { apiClient } from "./client";
import { Product } from "./products";

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  total_price: string;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    return apiClient.get<Cart>("/cart");
  },

  addToCart: async (data: AddToCartRequest): Promise<CartItem> => {
    return apiClient.post<CartItem>("/cart/items", data);
  },

  updateCartItem: async (itemId: number, data: UpdateCartItemRequest): Promise<CartItem> => {
    return apiClient.patch<CartItem>(`/cart/items/${itemId}`, data);
  },

  removeFromCart: async (itemId: number): Promise<void> => {
    return apiClient.delete(`/cart/items/${itemId}`);
  },
};

