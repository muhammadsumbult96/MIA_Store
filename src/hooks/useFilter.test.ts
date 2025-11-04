import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilter } from './useFilter';
import { Product } from '@/lib/types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Apple',
    description: 'Red apple',
    price: 10,
    image: 'apple.jpg',
    category: 'Fruit',
    categoryId: 'fruit',
    rating: 4.5,
    reviewCount: 100,
    inStock: true,
    tags: ['fruit', 'red'],
  },
  {
    id: '2',
    name: 'Banana',
    description: 'Yellow banana',
    price: 5,
    image: 'banana.jpg',
    category: 'Fruit',
    categoryId: 'fruit',
    rating: 4.0,
    reviewCount: 50,
    inStock: true,
    tags: ['fruit', 'yellow'],
  },
  {
    id: '3',
    name: 'Laptop',
    description: 'Gaming laptop',
    price: 1000,
    image: 'laptop.jpg',
    category: 'Electronics',
    categoryId: 'electronics',
    rating: 4.8,
    reviewCount: 200,
    inStock: true,
    tags: ['electronics', 'computer'],
  },
];

describe('useFilter', () => {
  it('should return all products by default', () => {
    const { result } = renderHook(() => useFilter(mockProducts));

    expect(result.current.filteredAndSortedProducts).toHaveLength(3);
  });

  it('should filter by category', () => {
    const { result } = renderHook(() => useFilter(mockProducts));

    act(() => {
      result.current.updateFilter('category', 'fruit');
    });

    expect(result.current.filteredAndSortedProducts).toHaveLength(2);
    expect(result.current.filteredAndSortedProducts.every((p) => p.categoryId === 'fruit')).toBe(
      true
    );
  });

  it('should filter by min price', () => {
    const { result } = renderHook(() => useFilter(mockProducts));

    act(() => {
      result.current.updateFilter('minPrice', 100);
    });

    expect(result.current.filteredAndSortedProducts).toHaveLength(1);
    expect(result.current.filteredAndSortedProducts[0].price).toBeGreaterThanOrEqual(100);
  });

  it('should filter by max price', () => {
    const { result } = renderHook(() => useFilter(mockProducts));

    act(() => {
      result.current.updateFilter('maxPrice', 50);
    });

    expect(result.current.filteredAndSortedProducts).toHaveLength(2);
    expect(result.current.filteredAndSortedProducts.every((p) => p.price <= 50)).toBe(true);
  });

  it('should filter by min rating', () => {
    const { result } = renderHook(() => useFilter(mockProducts));

    act(() => {
      result.current.updateFilter('minRating', 4.5);
    });

    expect(result.current.filteredAndSortedProducts).toHaveLength(2);
    expect(
      result.current.filteredAndSortedProducts.every((p) => p.rating >= 4.5)
    ).toBe(true);
  });

  it('should filter by search query', () => {
    const { result } = renderHook(() => useFilter(mockProducts));

    act(() => {
      result.current.setSearchQuery('apple');
    });

    expect(result.current.filteredAndSortedProducts).toHaveLength(1);
    expect(result.current.filteredAndSortedProducts[0].name.toLowerCase()).toContain('apple');
  });

  it('should search in tags', () => {
    const { result } = renderHook(() => useFilter(mockProducts));

    act(() => {
      result.current.setSearchQuery('red');
    });

    expect(result.current.filteredAndSortedProducts).toHaveLength(1);
  });

  it('should sort by price ascending', () => {
    const { result } = renderHook(() => useFilter(mockProducts));

    act(() => {
      result.current.setSortOption('price-asc');
    });

    const prices = result.current.filteredAndSortedProducts.map((p) => p.price);
    expect(prices).toEqual([5, 10, 1000]);
  });

  it('should sort by price descending', () => {
    const { result } = renderHook(() => useFilter(mockProducts));

    act(() => {
      result.current.setSortOption('price-desc');
    });

    const prices = result.current.filteredAndSortedProducts.map((p) => p.price);
    expect(prices).toEqual([1000, 10, 5]);
  });

  it('should sort by name ascending', () => {
    const { result } = renderHook(() => useFilter(mockProducts));

    act(() => {
      result.current.setSortOption('name-asc');
    });

    const names = result.current.filteredAndSortedProducts.map((p) => p.name);
    expect(names).toEqual(['Apple', 'Banana', 'Laptop']);
  });

  it('should sort by rating descending', () => {
    const { result } = renderHook(() => useFilter(mockProducts));

    act(() => {
      result.current.setSortOption('rating-desc');
    });

    const ratings = result.current.filteredAndSortedProducts.map((p) => p.rating);
    expect(ratings).toEqual([4.8, 4.5, 4.0]);
  });

  it('should combine multiple filters', () => {
    const { result } = renderHook(() => useFilter(mockProducts));

    act(() => {
      result.current.updateFilter('category', 'fruit');
      result.current.updateFilter('minPrice', 5);
      result.current.updateFilter('maxPrice', 10);
    });

    expect(result.current.filteredAndSortedProducts).toHaveLength(1);
    expect(result.current.filteredAndSortedProducts[0].name).toBe('Apple');
  });

  it('should clear all filters', () => {
    const { result } = renderHook(() => useFilter(mockProducts));

    act(() => {
      result.current.updateFilter('category', 'fruit');
      result.current.setSearchQuery('apple');
      result.current.clearFilters();
    });

    expect(result.current.filteredAndSortedProducts).toHaveLength(3);
    expect(result.current.filters).toEqual({});
    expect(result.current.searchQuery).toBe('');
  });
});

