import { apiClient } from "./client";
import { Product } from "./products";

export interface WishlistItem {
  id: number;
  product: Product;
}

export const wishlistApi = {
  getWishlist: async (): Promise<WishlistItem[]> => {
    return apiClient.get<WishlistItem[]>("/wishlist");
  },

  addToWishlist: async (productId: number): Promise<WishlistItem> => {
    return apiClient.post<WishlistItem>(`/wishlist/items?product_id=${productId}`);
  },

  removeFromWishlist: async (itemId: number): Promise<void> => {
    return apiClient.delete(`/wishlist/items/${itemId}`);
  },

  checkWishlist: async (productId: number): Promise<{ in_wishlist: boolean }> => {
    return apiClient.get<{ in_wishlist: boolean }>(`/wishlist/check/${productId}`);
  },
};

