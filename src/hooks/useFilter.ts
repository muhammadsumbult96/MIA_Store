import { useState, useMemo } from 'react';
import { Product, FilterOptions, SortOption } from '@/lib/types';

export function useFilter(products: Product[]) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (filters.category) {
      filtered = filtered.filter((product) => product.categoryId === filters.category);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((product) => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((product) => product.price <= filters.maxPrice!);
    }

    if (filters.minRating !== undefined) {
      filtered = filtered.filter((product) => product.rating >= filters.minRating!);
    }

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'rating-desc':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters, sortOption, searchQuery]);

  const updateFilter = (key: keyof FilterOptions, value: string | number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' || value === undefined ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  return {
    filteredAndSortedProducts,
    filters,
    sortOption,
    searchQuery,
    setFilters,
    updateFilter,
    setSortOption,
    setSearchQuery,
    clearFilters,
  };
}

