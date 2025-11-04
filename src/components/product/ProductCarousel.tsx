'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
  title: string;
}

export function ProductCarousel({ products, title }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateItemsPerView = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) setItemsPerView(4);
        else if (window.innerWidth >= 768) setItemsPerView(3);
        else if (window.innerWidth >= 640) setItemsPerView(2);
        else setItemsPerView(1);
      }
    };

    updateItemsPerView();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateItemsPerView);
      return () => window.removeEventListener('resize', updateItemsPerView);
    }
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

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
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous products"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                disabled={currentIndex >= maxIndex}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next products"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
      <div className="overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

