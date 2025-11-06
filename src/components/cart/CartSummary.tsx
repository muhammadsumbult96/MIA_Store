'use client';

import { useCart } from '@/hooks/useCart';
import { formatPrice, formatVND } from '@/lib/utils/format';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export function CartSummary() {
  const { items, getSubtotal, getShipping, getTotal } = useCart();
  const { language, t } = useLanguage();
  const currency = language === 'vi' ? 'VND' : 'USD';
  const exchangeRate = 23000;
  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();
  
  const formatCurrency = (amount: number) => {
    return currency === 'VND' ? formatVND(amount * exchangeRate) : formatPrice(amount);
  };

  return (
    <div className="space-y-4">
      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          {language === 'vi' ? 'Tóm tắt đơn hàng' : 'Order Summary'}
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-modern">
          {items.map((item) => (
            <div key={item.id} className="text-sm">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.product.name}</p>
                  <div className="mt-1 space-y-0.5">
                    {item.selectedSize && (
                      <p className="text-xs text-gray-600">
                        {t('product.size')}: {item.selectedSize}
                      </p>
                    )}
                    {item.selectedColor && (
                      <p className="text-xs text-gray-600">
                        {t('product.color')}: {item.selectedColor}
                      </p>
                    )}
                    <p className="text-xs text-gray-600">
                      {language === 'vi' ? 'Số lượng' : 'Quantity'}: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 whitespace-nowrap ml-2">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('cart.subtotal')}</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('cart.shipping')}</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">{t('cart.free')}</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>
        {subtotal > 0 && subtotal < 100 && (
          <p className="text-xs text-gray-500">
            {t('cart.freeShippingHint').replace('{amount}', formatCurrency(100 - subtotal))}
          </p>
        )}
        <div className="flex justify-between text-lg font-bold pt-2 border-t">
          <span>{t('cart.total')}</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}

