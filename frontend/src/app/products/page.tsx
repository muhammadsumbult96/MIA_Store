"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilter from "@/components/products/ProductFilter";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  
  const { data, loading, error } = useProducts({
    page,
    page_size: 20,
    category_id: categoryId,
    search: search || undefined,
    min_price: minPrice,
    max_price: maxPrice,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  if (loading && !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error loading products: {error.message}</div>
      </div>
    );
  }

  const handleFilterChange = (filters: {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    setCategoryId(filters.categoryId);
    setMinPrice(filters.minPrice);
    setMaxPrice(filters.maxPrice);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProductFilter onFilterChange={handleFilterChange} />
        </div>

        <div className="lg:col-span-3">
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Search</Button>
            </form>
          </div>

          {data && (
            <>
              <ProductGrid products={data.items} />

              {data.total_pages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {page} of {data.total_pages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page >= data.total_pages}
                    onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

