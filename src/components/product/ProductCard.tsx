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
  variant?: 'default' | 'sale' | 'collections';
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCart();
  const { showToast } = useToast();
  const { language, t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
  
  const images = product.images || [product.image];
  const primaryImage = images[0];
  const secondaryImage = images.length > 1 ? images[1] : images[0];

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(product, 1);
    showToast(`${product.name} ${t('product.addToCart')}`, 'success');
    setTimeout(() => setIsAdding(false), 500);
  };

  const isDark = variant === 'collections';
  const isSale = variant === 'sale';

  return (
    <div className={`group relative ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <Link href={`/products/${product.id}`} className="block">
        <div 
          className="relative aspect-[3/4] overflow-hidden bg-gray-50"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {primaryImage && (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className={`object-cover group-hover:scale-105 transition-all duration-1000 ease-in-out ${
                isHovered && images.length > 1 ? 'opacity-0' : 'opacity-100'
              }`}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          {secondaryImage && images.length > 1 && (
            <Image
              src={secondaryImage}
              alt={product.name}
              fill
              className={`object-cover group-hover:scale-105 transition-all duration-1000 ease-in-out absolute inset-0 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          {discount > 0 && (
            <div className="absolute top-3 left-3">
              <Badge 
                variant={isSale ? "error" : "error"} 
                className={`text-xs font-semibold px-2 py-1 ${
                  isSale ? 'bg-red-600 text-white' : ''
                }`}
              >
                -{discount}%
              </Badge>
            </div>
          )}
          {!product.inStock && (
            <div className={`absolute inset-0 ${isDark ? 'bg-gray-900' : 'bg-white'} bg-opacity-90 flex items-center justify-center`}>
              <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} uppercase tracking-wide`}>
                {t('product.outOfStock')}
              </span>
            </div>
          )}
          <div className={`absolute inset-0 ${isDark ? 'bg-white' : 'bg-black'} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        </div>
      </Link>
      <div className="pt-4 pb-2">
        <Link href={`/products/${product.id}`}>
          <h3 className={`text-sm font-medium mb-0.5 line-clamp-2 transition-colors min-h-[2.5rem] ${
            isDark 
              ? 'text-white group-hover:text-gray-300' 
              : isSale
              ? 'text-gray-900 group-hover:text-red-600'
              : 'text-gray-900 group-hover:text-primary-900'
          }`}>
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className={`text-base font-semibold ${isDark ? 'text-white' : isSale ? 'text-red-600' : 'text-gray-900'}`}>
            {displayPrice}
          </span>
          {displayOriginalPrice && (
            <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'} line-through`}>
              {displayOriginalPrice}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className={`w-full py-2.5 text-xs font-medium rounded-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide ${
            isDark
              ? 'text-white border border-white/30 hover:border-white hover:bg-white/10'
              : isSale
              ? 'text-red-600 border border-red-600 hover:bg-red-600 hover:text-white'
              : 'text-gray-900 border border-gray-300 hover:border-gray-900 hover:bg-gray-50'
          }`}
        >
          {isAdding ? '...' : quantity > 0 ? `${t('product.addToCart')} (${quantity})` : t('product.addToCart')}
        </button>
      </div>
    </div>
  );
}

