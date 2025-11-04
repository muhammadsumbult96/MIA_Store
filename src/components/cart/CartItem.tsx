'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import { formatPrice, formatVND } from '@/lib/utils/format';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/Button';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { language } = useLanguage();
  const currency = language === 'vi' ? 'VND' : 'USD';
  const exchangeRate = 23000; // USD to VND
  
  const formatCurrency = (amount: number) => {
    return currency === 'VND' ? formatVND(amount * exchangeRate) : formatPrice(amount);
  };

  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{item.product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{formatCurrency(item.product.price)}</p>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="w-8 h-8 p-0 flex items-center justify-center"
          >
            -
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            className="w-8 h-8 p-0 flex items-center justify-center"
          >
            +
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeItem(item.product.id)}
          className="text-gray-400 hover:text-red-600 transition-colors"
          aria-label="Remove item"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <p className="font-semibold text-gray-900">
          {formatCurrency(item.product.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}

