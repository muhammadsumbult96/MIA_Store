import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useProducts, useProduct } from "@/hooks/useProducts";
import { productsApi } from "@/lib/api/products";

vi.mock("@/lib/api/products", () => ({
  productsApi: {
    getProducts: vi.fn(),
    getProduct: vi.fn(),
  },
}));

describe("useProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch products successfully", async () => {
    const mockProducts = {
      items: [
        { id: 1, name: "Product 1", price: "100000" },
        { id: 2, name: "Product 2", price: "200000" },
      ],
      total: 2,
      page: 1,
      page_size: 20,
      total_pages: 1,
    };

    vi.mocked(productsApi.getProducts).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
  });

  it("should handle errors", async () => {
    const error = new Error("Failed to fetch");
    vi.mocked(productsApi.getProducts).mockRejectedValue(error);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeNull();
  });

  it("should refetch when filters change", async () => {
    const { rerender } = renderHook(
      ({ filters }) => useProducts(filters),
      {
        initialProps: { filters: { page: 1 } },
      }
    );

    await waitFor(() => {
      expect(productsApi.getProducts).toHaveBeenCalled();
    });

    rerender({ filters: { page: 2 } });

    await waitFor(() => {
      expect(productsApi.getProducts).toHaveBeenCalledTimes(2);
    });
  });
});

describe("useProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch single product successfully", async () => {
    const mockProduct = {
      id: 1,
      name: "Product 1",
      price: "100000",
    };

    vi.mocked(productsApi.getProduct).mockResolvedValue(mockProduct);

    const { result } = renderHook(() => useProduct(1));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.product).toEqual(mockProduct);
    expect(result.current.error).toBeNull();
  });

  it("should not fetch when id is null", () => {
    renderHook(() => useProduct(null));

    expect(productsApi.getProduct).not.toHaveBeenCalled();
  });
});

