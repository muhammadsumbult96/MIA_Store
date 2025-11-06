'use client';

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  variant?: 'default' | 'sale' | 'collections';
  singleRow?: boolean;
  renderArrowsOnly?: boolean;
  externalIndex?: number;
  onIndexChange?: (index: number) => void;
}

export function ProductCarousel({ 
  products, 
  title, 
  variant = 'default', 
  singleRow = false, 
  renderArrowsOnly = false,
  externalIndex,
  onIndexChange
}: ProductCarouselProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(singleRow ? 4 : 4);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex;
  const setCurrentIndex = onIndexChange || setInternalIndex;

  useEffect(() => {
    setIsMounted(true);
    const updateItemsPerView = () => {
      if (typeof window !== 'undefined') {
        if (singleRow) {
          if (window.innerWidth >= 1024) setItemsPerView(4);
          else if (window.innerWidth >= 768) setItemsPerView(3);
          else if (window.innerWidth >= 640) setItemsPerView(2);
          else setItemsPerView(1);
        } else {
          if (window.innerWidth >= 1024) setItemsPerView(4);
          else if (window.innerWidth >= 768) setItemsPerView(3);
          else if (window.innerWidth >= 640) setItemsPerView(2);
          else setItemsPerView(1);
        }
      }
    };

    updateItemsPerView();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateItemsPerView);
      return () => window.removeEventListener('resize', updateItemsPerView);
    }
  }, [singleRow]);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const ArrowButtons = () => (
    singleRow && products.length > itemsPerView ? (
      <div className="flex gap-2">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className={`p-2.5 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all backdrop-blur-sm ${
            variant === 'sale'
              ? 'bg-white/90 hover:bg-white text-red-600 border border-red-200 shadow-sm'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
          }`}
          aria-label="Previous products"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          disabled={currentIndex >= maxIndex}
          className={`p-2.5 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all backdrop-blur-sm ${
            variant === 'sale'
              ? 'bg-white/90 hover:bg-white text-red-600 border border-red-200 shadow-sm'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
          }`}
          aria-label="Next products"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    ) : null
  );

  if (renderArrowsOnly) {
    return <ArrowButtons />;
  }

  return (
    <div className="relative">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
          {products.length > itemsPerView && (
            <div className="flex gap-2">
              <button
                onClick={prev}
                disabled={currentIndex === 0}
                className={`p-2.5 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all backdrop-blur-sm ${
                  variant === 'collections'
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    : variant === 'sale'
                    ? 'bg-white/90 hover:bg-white text-red-600 border border-red-200 shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
                aria-label="Previous products"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                disabled={currentIndex >= maxIndex}
                className={`p-2.5 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all backdrop-blur-sm ${
                  variant === 'collections'
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    : variant === 'sale'
                    ? 'bg-white/90 hover:bg-white text-red-600 border border-red-200 shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
                aria-label="Next products"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
      <div className="overflow-hidden relative" ref={containerRef}>
        {singleRow ? (
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(-${currentIndex} * (100% / ${itemsPerView}) - ${currentIndex * 1}rem))`,
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0"
                style={{ width: `calc((100% - ${(itemsPerView - 1) * 1}rem) / ${itemsPerView})` }}
              >
                <ProductCard product={product} variant={variant} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} variant={variant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

