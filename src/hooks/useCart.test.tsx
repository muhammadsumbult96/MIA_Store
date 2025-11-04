import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './useCart';
import { Product } from '@/lib/types';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 29.99,
  image: 'test.jpg',
  category: 'Test',
  categoryId: 'test',
  rating: 4.5,
  reviewCount: 100,
  inStock: true,
};

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe('1');
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('should update quantity when adding existing item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 1);
      result.current.addItem(mockProduct, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 1);
      result.current.removeItem('1');
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 1);
      result.current.updateQuantity('1', 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
  });

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 1);
      result.current.updateQuantity('1', 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 1);
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should calculate total items correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 3);
    });

    expect(result.current.getTotalItems()).toBe(3);
  });

  it('should calculate subtotal correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 2);
    });

    expect(result.current.getSubtotal()).toBe(59.98);
  });

  it('should calculate shipping correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 1);
    });

    expect(result.current.getShipping()).toBe(10);
  });

  it('should provide free shipping for orders over $100', () => {
    const expensiveProduct: Product = {
      ...mockProduct,
      price: 150,
    };

    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(expensiveProduct, 1);
    });

    expect(result.current.getShipping()).toBe(0);
  });

  it('should calculate total correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 2);
    });

    const subtotal = result.current.getSubtotal();
    const shipping = result.current.getShipping();
    const total = result.current.getTotal();

    expect(total).toBe(subtotal + shipping);
  });

  it('should get item quantity correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 3);
    });

    expect(result.current.getItemQuantity('1')).toBe(3);
    expect(result.current.getItemQuantity('2')).toBe(0);
  });

  it('should persist cart to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockProduct, 1);
    });

    const stored = localStorage.getItem('mia-cart');
    expect(stored).toBeTruthy();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed).toHaveLength(1);
    }
  });
});

