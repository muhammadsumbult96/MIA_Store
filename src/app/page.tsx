'use client';

import Link from 'next/link';
import Image from 'next/image';
import { sampleProducts } from '@/lib/constants/products';
import { ProductCarousel } from '@/components/product/ProductCarousel';
import { InstagramFeed } from '@/components/social/InstagramFeed';
import { useLanguage } from '@/hooks/useLanguage';

export default function HomePage() {
  const { t } = useLanguage();
  const newArrivals = sampleProducts.slice(0, 8);
  const saleProducts = sampleProducts.filter((p) => p.originalPrice).slice(0, 8);
  const fashionProducts = sampleProducts.filter((p) => p.categoryId === 'fashion' || p.categoryId === 'accessories').slice(0, 8);

  return (
    <div>
      <section className="relative h-[600px] md:h-[700px] bg-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1920"
            alt="Hero"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
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
      </section>

      <section className="py-16 md:py-20">
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
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900">{t('common.sale')}</h2>
              <Link
                href="/products?category=sale"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors uppercase tracking-wide"
              >
                View All →
              </Link>
            </div>
            <ProductCarousel products={saleProducts} title="" />
          </div>
        </section>
      )}

      {fashionProducts.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-light text-gray-900">{t('common.collections')}</h2>
              <Link
                href="/products?category=fashion"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors uppercase tracking-wide"
              >
                View All →
              </Link>
            </div>
            <ProductCarousel products={fashionProducts} title="" />
          </div>
        </section>
      )}

      <InstagramFeed />
    </div>
  );
}

