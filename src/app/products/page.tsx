'use client';

import { useState } from 'react';
import { sampleProducts, categories } from '@/lib/constants/products';
import { useFilter } from '@/hooks/useFilter';
import { ProductCard } from '@/components/product/ProductCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/hooks/useLanguage';
import { formatPrice, formatVND } from '@/lib/utils/format';

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { t, language } = useLanguage();
  const {
    filteredAndSortedProducts,
    filters,
    sortOption,
    searchQuery,
    updateFilter,
    setSortOption,
    setSearchQuery,
    clearFilters,
  } = useFilter(sampleProducts);

  const currency = language === 'vi' ? 'VND' : 'USD';
  const exchangeRate = 23000; // USD to VND
  const maxPrice = Math.max(...sampleProducts.map((p) => p.price));
  const minPrice = Math.min(...sampleProducts.map((p) => p.price));
  const displayMinPrice = currency === 'VND' ? formatVND(minPrice * exchangeRate) : formatPrice(minPrice);
  const displayMaxPrice = currency === 'VND' ? formatVND(maxPrice * exchangeRate) : formatPrice(maxPrice);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside
          className={`${
            isFilterOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 flex-shrink-0`}
        >
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t('products.filters')}</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="md:hidden text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('products.search')}
                </label>
                <Input
                  type="text"
                  placeholder={t('products.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('products.category')}
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={filters.category || ''}
                  onChange={(e) => updateFilter('category', e.target.value)}
                >
                  <option value="">{t('products.allCategories')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('products.priceRange')}
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={t('products.min')}
                    value={filters.minPrice || ''}
                    onChange={(e) =>
                      updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                  <Input
                    type="number"
                    placeholder={t('products.max')}
                    value={filters.maxPrice || ''}
                    onChange={(e) =>
                      updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {displayMinPrice} - {displayMaxPrice}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('products.minimumRating')}
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={filters.minRating || ''}
                  onChange={(e) =>
                    updateFilter('minRating', e.target.value ? Number(e.target.value) : undefined)
                  }
                >
                  <option value="">{t('products.anyRating')}</option>
                  <option value="4">{t('products.rating4')}</option>
                  <option value="4.5">{t('products.rating45')}</option>
                </select>
              </div>

              <Button variant="outline" className="w-full" onClick={clearFilters}>
                {t('products.clearFilters')}
              </Button>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {t('products.filters')}
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('products.title')} ({filteredAndSortedProducts.length})
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">{t('products.sortBy')}:</label>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
              >
                <option value="name-asc">{t('products.sortNameAsc')}</option>
                <option value="name-desc">{t('products.sortNameDesc')}</option>
                <option value="price-asc">{t('products.sortPriceAsc')}</option>
                <option value="price-desc">{t('products.sortPriceDesc')}</option>
                <option value="rating-desc">{t('products.sortRatingDesc')}</option>
              </select>
            </div>
          </div>

          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('products.noProducts')}</p>
              <Button onClick={clearFilters} className="mt-4" variant="primary">
                {t('products.clearFilters')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

