'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import { formatPrice, formatVND } from '@/lib/utils/format';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/Button';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, updateCartItemVariants } = useCart();
  const { language, t } = useLanguage();
  const [isEditingVariants, setIsEditingVariants] = useState(false);
  const [selectedSize, setSelectedSize] = useState(item.selectedSize || '');
  const [selectedColor, setSelectedColor] = useState(item.selectedColor || '');
  const currency = language === 'vi' ? 'VND' : 'USD';
  const exchangeRate = 23000;
  
  const formatCurrency = (amount: number) => {
    return currency === 'VND' ? formatVND(amount * exchangeRate) : formatPrice(amount);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    if (updateCartItemVariants) {
      updateCartItemVariants(item.id, { selectedSize: size });
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (updateCartItemVariants) {
      updateCartItemVariants(item.id, { selectedColor: color });
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0">
      <Link href={`/products/${item.product.id}`} className="relative w-20 h-20 flex-shrink-0 hover:opacity-80 transition-opacity">
        <Image
          src={item.product.image}
          alt={item.product.name}
          fill
          className="object-cover rounded-lg"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.id}`}>
          <h3 className="font-medium text-gray-900 truncate hover:text-primary-900 transition-colors cursor-pointer">
            {item.product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1">{formatCurrency(item.product.price)}</p>
        
        {(item.product.sizes || item.product.colors) && (
          <div className="mt-2 space-y-2">
            {item.product.sizes && item.product.sizes.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">{t('product.size')}:</span>
                <div className="flex gap-1">
                  {item.product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`px-2 py-1 text-xs border rounded transition-all ${
                        selectedSize === size
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {item.product.colors && item.product.colors.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">{t('product.color')}:</span>
                <div className="flex gap-1">
                  {item.product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`px-2 py-1 text-xs border rounded transition-all ${
                        selectedColor === color
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 p-0 flex items-center justify-center"
          >
            -
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 p-0 flex items-center justify-center"
          >
            +
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeItem(item.id)}
          className="text-gray-400 hover:text-red-600 transition-colors"
          aria-label={t('cart.removeItem')}
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

