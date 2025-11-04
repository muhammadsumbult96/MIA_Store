export function formatPrice(price: number, currency: 'USD' | 'VND' = 'USD'): string {
  if (currency === 'VND') {
    return formatVND(price);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatVND(amount: number): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}đ`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

