'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { sampleProducts } from '@/lib/constants/products';
import { sampleCollections } from '@/lib/constants/collections';
import { ProductCarousel } from '@/components/product/ProductCarousel';
import { CollectionsShowcase } from '@/components/collection/CollectionsShowcase';
import { InstagramFeed } from '@/components/social/InstagramFeed';
import { useLanguage } from '@/hooks/useLanguage';

const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1920',
    alt: 'Fashion Collection',
  },
  {
    src: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1920',
    alt: 'New Arrivals',
  },
  {
    src: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1920',
    alt: 'Summer Collection',
  },
];

export default function HomePage() {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [saleCarouselIndex, setSaleCarouselIndex] = useState(0);
  const newArrivals = sampleProducts.slice(0, 8);
  const saleProducts = sampleProducts.filter((p) => p.originalPrice).slice(0, 8);
  const fashionProducts = sampleProducts.filter((p) => p.categoryId === 'fashion' || p.categoryId === 'accessories').slice(0, 8);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <section className="relative h-[360px] md:h-[460px] lg:h-[560px] bg-white overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <Image
              key={index}
              src={image.src}
              alt={image.alt}
              fill
              className={`object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 absolute z-0'
              }`}
              priority={index === 0}
              sizes="100vw"
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 tracking-tight">
              New Collection
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 font-light">
              Discover timeless elegance and modern sophistication
            </p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-white text-gray-900 text-sm font-medium uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              {t('common.newArrivals')}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900">{t('common.newArrivals')}</h2>
            <Link
              href="/products?category=new"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors uppercase tracking-wide"
            >
              View All →
            </Link>
          </div>
          <ProductCarousel products={newArrivals} title="" />
        </div>
      </section>

      {saleProducts.length > 0 && (
        <section className="py-8 md:py-12 bg-gradient-to-b from-red-50 to-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-12 bg-red-600"></div>
                <h2 className="text-2xl md:text-3xl font-light text-gray-900">{t('common.sale')}</h2>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/products?category=sale"
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors uppercase tracking-wide"
                >
                  View All →
                </Link>
                <ProductCarousel 
                  products={saleProducts} 
                  title="" 
                  variant="sale" 
                  singleRow 
                  renderArrowsOnly 
                  externalIndex={saleCarouselIndex}
                  onIndexChange={setSaleCarouselIndex}
                />
              </div>
            </div>
            <ProductCarousel 
              products={saleProducts} 
              title="" 
              variant="sale" 
              singleRow 
              externalIndex={saleCarouselIndex}
              onIndexChange={setSaleCarouselIndex}
            />
          </div>
        </section>
      )}

      <CollectionsShowcase collections={sampleCollections.slice(0, 6)} />

      <InstagramFeed />
    </div>
  );
}

