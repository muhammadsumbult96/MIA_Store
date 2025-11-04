'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice, formatVND, calculateDiscount } from '@/lib/utils/format';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/hooks/useLanguage';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCart();
  const { showToast } = useToast();
  const { language, t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const quantity = getItemQuantity(product.id);
  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;
  const currency = language === 'vi' ? 'VND' : 'USD';
  const displayPrice = currency === 'VND' ? formatVND(product.price * 23000) : formatPrice(product.price);
  const displayOriginalPrice = product.originalPrice
    ? currency === 'VND'
      ? formatVND(product.originalPrice * 23000)
      : formatPrice(product.originalPrice)
    : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(product, 1);
    showToast(`${product.name} ${t('product.addToCart')}`, 'success');
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="group relative bg-white">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {discount > 0 && (
            <div className="absolute top-3 left-3">
              <Badge variant="error" className="text-xs font-semibold px-2 py-1">
                -{discount}%
              </Badge>
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                {t('product.outOfStock')}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        </div>
      </Link>
      <div className="pt-4 pb-2">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-900 mb-1.5 line-clamp-2 group-hover:text-primary-900 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="text-xs text-gray-500">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-semibold text-gray-900">
            {displayPrice}
          </span>
          {displayOriginalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {displayOriginalPrice}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className="w-full py-2.5 text-xs font-medium text-gray-900 border border-gray-300 rounded-sm hover:border-gray-900 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
        >
          {isAdding ? '...' : quantity > 0 ? `${t('product.addToCart')} (${quantity})` : t('product.addToCart')}
        </button>
      </div>
    </div>
  );
}

