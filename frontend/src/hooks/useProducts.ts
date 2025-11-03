import { useState, useEffect } from "react";
import { productsApi, Product, ProductListResponse, ProductFilters } from "@/lib/api/products";

export function useProducts(filters?: ProductFilters) {
  const [data, setData] = useState<ProductListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsApi.getProducts(filters);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch products"));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters?.page, filters?.category_id, filters?.search, filters?.min_price, filters?.max_price]);

  return { data, loading, error };
}

export function useProduct(id: number | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productsApi.getProduct(id);
        setProduct(response);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch product"));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}

