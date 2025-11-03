import { apiClient } from "./client";

export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: string;
  comment?: string;
  title?: string;
  created_at: string;
  user_name?: string;
}

export interface ReviewListResponse {
  items: Review[];
  total: number;
  average_rating: string;
}

export interface CreateReviewRequest {
  product_id: number;
  rating: number;
  comment?: string;
  title?: string;
}

export const reviewsApi = {
  createReview: async (data: CreateReviewRequest): Promise<Review> => {
    return apiClient.post<Review>("/reviews", data);
  },

  getProductReviews: async (
    productId: number,
    page = 1,
    pageSize = 10
  ): Promise<ReviewListResponse> => {
    return apiClient.get<ReviewListResponse>(
      `/reviews/product/${productId}?page=${page}&page_size=${pageSize}`
    );
  },
};

