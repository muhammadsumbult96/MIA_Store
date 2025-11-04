import { describe, it, expect } from 'vitest';
import { formatPrice, formatRating, calculateDiscount } from './format';

describe('formatPrice', () => {
  it('should format price correctly', () => {
    expect(formatPrice(29.99)).toBe('$29.99');
    expect(formatPrice(100)).toBe('$100.00');
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('should handle decimal prices', () => {
    expect(formatPrice(19.5)).toBe('$19.50');
    expect(formatPrice(99.999)).toBe('$100.00');
  });

  it('should handle large prices', () => {
    expect(formatPrice(1000)).toBe('$1,000.00');
    expect(formatPrice(123456.78)).toBe('$123,456.78');
  });
});

describe('formatRating', () => {
  it('should format rating to one decimal place', () => {
    expect(formatRating(4.5)).toBe('4.5');
    expect(formatRating(4.567)).toBe('4.6');
    expect(formatRating(5)).toBe('5.0');
  });

  it('should handle zero rating', () => {
    expect(formatRating(0)).toBe('0.0');
  });
});

describe('calculateDiscount', () => {
  it('should calculate discount percentage correctly', () => {
    expect(calculateDiscount(100, 80)).toBe(20);
    expect(calculateDiscount(200, 150)).toBe(25);
    expect(calculateDiscount(50, 25)).toBe(50);
  });

  it('should return 0 when no discount', () => {
    expect(calculateDiscount(100, 100)).toBe(0);
  });

  it('should round discount to nearest integer', () => {
    expect(calculateDiscount(100, 83)).toBe(17);
    expect(calculateDiscount(100, 66.66)).toBe(33);
  });
});

