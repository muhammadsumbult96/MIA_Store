import { apiClient } from "./client";

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: string;
  discounted_price?: string;
  stock_quantity: number;
  sku: string;
  category_id: number;
  is_active: boolean;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  images?: Array<{
    id: number;
    image_url: string;
    alt_text?: string;
    is_primary: boolean;
    display_order: number;
  }>;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ProductFilters {
  page?: number;
  page_size?: number;
  category_id?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
}

export const productsApi = {
  getProducts: async (filters?: ProductFilters): Promise<ProductListResponse> => {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.page_size) params.append("page_size", filters.page_size.toString());
    if (filters?.category_id) params.append("category_id", filters.category_id.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.min_price) params.append("min_price", filters.min_price.toString());
    if (filters?.max_price) params.append("max_price", filters.max_price.toString());

    const query = params.toString();
    return apiClient.get<ProductListResponse>(
      `/products${query ? `?${query}` : ""}`
    );
  },

  getProduct: async (id: number): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}`);
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    return apiClient.get<Product>(`/products/slug/${slug}`);
  },

  getCategories: async (): Promise<Array<{ id: number; name: string; slug: string }>> => {
    return apiClient.get<Array<{ id: number; name: string; slug: string }>>("/categories");
  },
};

