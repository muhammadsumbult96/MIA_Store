'use client';

import { useCart } from '@/hooks/useCart';
import { formatPrice, formatVND } from '@/lib/utils/format';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function CartSummary() {
  const { getSubtotal, getShipping, getTotal } = useCart();
  const { language } = useLanguage();
  const currency = language === 'vi' ? 'VND' : 'USD';
  const exchangeRate = 23000; // USD to VND
  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();
  
  const formatCurrency = (amount: number) => {
    return currency === 'VND' ? formatVND(amount * exchangeRate) : formatPrice(amount);
  };

  return (
    <div className="border-t pt-4 space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Shipping</span>
        <span className="font-medium">
          {shipping === 0 ? (
            <span className="text-green-600">Free</span>
          ) : (
            formatCurrency(shipping)
          )}
        </span>
      </div>
      {subtotal > 0 && subtotal < 100 && (
        <p className="text-xs text-gray-500">
          Add {formatCurrency(100 - subtotal)} more for free shipping!
        </p>
      )}
      <div className="flex justify-between text-lg font-bold pt-2 border-t">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
      <Link href="/cart" className="block">
        <Button className="w-full" variant="primary">
          View Cart
        </Button>
      </Link>
      <Link href="/checkout" className="block">
        <Button className="w-full" variant="primary">
          Checkout
        </Button>
      </Link>
    </div>
  );
}

