'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { sampleProducts } from '@/lib/constants/products';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { formatPrice, formatVND, calculateDiscount } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductCarousel } from '@/components/product/ProductCarousel';
import { ProductReviews } from '@/components/product/ProductReviews';
import { ShareButtons } from '@/components/product/ShareButtons';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useLanguage } from '@/hooks/useLanguage';
import { sampleReviews } from '@/lib/constants/reviews';
import { categories } from '@/lib/constants/products';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const product = sampleProducts.find((p) => p.id === id);
  const { addItem, getItemQuantity } = useCart();
  const { showToast } = useToast();
  const { language, t } = useLanguage();

  // Scroll to top when product page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [sizeError, setSizeError] = useState('');
  const [colorError, setColorError] = useState('');
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  if (!product) {
    notFound();
  }

  const currency = language === 'vi' ? 'VND' : 'USD';
  const exchangeRate = 23000; // USD to VND
  const displayPrice = currency === 'VND' ? formatVND(product.price * exchangeRate) : formatPrice(product.price);
  const displayOriginalPrice = product.originalPrice
    ? currency === 'VND'
      ? formatVND(product.originalPrice * exchangeRate)
      : formatPrice(product.originalPrice)
    : null;

  const images = product.images || [product.image];
  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0;
  const cartQuantity = getItemQuantity(product.id, selectedSize, selectedColor);
  const relatedProducts = sampleProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);
  const reviews = sampleReviews[product.id] || [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : product.rating;

  const handleAddToCart = () => {
    // Validate size and color if required
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeError(t('product.selectSize'));
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setColorError(t('product.selectColor'));
      return;
    }

    addItem(product, quantity, selectedSize || undefined, selectedColor || undefined);
    showToast(`${quantity} x ${product.name} ${t('product.addToCart')}!`, 'success');
    setQuantity(1);
    setSizeError('');
    setColorError('');
  };

  const handleImageZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPosition({ x, y });
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('svg') || target.closest('.z-20')) {
      return;
    }
    if (!isZoomed) {
      setIsZoomed(true);
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setZoomPosition({ x, y });
    } else {
      setIsZoomed(false);
    }
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextImage();
    }
    if (isRightSwipe) {
      handlePrevImage();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevImage();
    if (e.key === 'ArrowRight') handleNextImage();
    if (e.key === 'Escape') setIsFullscreen(false);
  };

  const category = categories.find((c) => c.id === product.categoryId);
  const breadcrumbItems = [
    { label: t('product.breadcrumbHome'), href: '/' },
    { label: t('product.breadcrumbProducts'), href: '/products' },
    ...(category ? [{ label: category.name, href: `/products?category=${category.id}` }] : []),
    { label: product.name, href: `/products/${id}` },
  ];

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 animate-fadeIn max-w-7xl">
      <Breadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 max-w-7xl mx-auto">
        <div className="space-y-4">
            <div
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in group max-w-lg mx-auto"
            onMouseMove={isZoomed ? handleImageZoom : undefined}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleImageClick}
          >
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 ease-out"
                    style={{
                      transform: isZoomed
                        ? `scale(4.5) translate(${(50 - zoomPosition.x) * 1.2}%, ${(50 - zoomPosition.y) * 1.2}%)`
                        : 'scale(1)',
                      transformOrigin: 'center center',
                      willChange: isZoomed ? 'transform' : 'auto',
                    }}
              />
            </div>
            {!isZoomed && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
                  {language === 'vi' ? 'Nhấp để phóng to' : 'Click to zoom'}
                </div>
              </div>
            )}
            {discount > 0 && (
              <Badge variant="error" className="absolute top-4 left-4 z-10">
                -{discount}%
              </Badge>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index
                      ? 'border-primary-600 scale-105 shadow-md'
                      : 'border-transparent hover:border-gray-300 hover:scale-102'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-300 ${
                      selectedImage === index ? 'opacity-100' : 'opacity-70'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}

            {isZoomed && !isFullscreen && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(false);
                }}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-20"
                aria-label="Close zoom"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

          {isFullscreen && (
              <div
                className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fadeIn"
                onClick={() => {
                  setIsFullscreen(false);
                  setIsZoomed(false);
                }}
                onKeyDown={handleKeyDown}
                tabIndex={0}
              >
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                aria-label="Close fullscreen"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      className="absolute left-4 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300"
                      aria-label="Previous image"
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      className="absolute right-4 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-300"
                      aria-label="Next image"
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      selectedImage === index ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <ShareButtons productName={product.name} productUrl={`/products/${id}`} />
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="ml-1 text-sm text-gray-700">
                  {product.rating} ({product.reviewCount} {t('product.reviews')})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-900">
              {displayPrice}
            </span>
            {displayOriginalPrice && (
              <span className="text-lg text-gray-500 line-through">
                {displayOriginalPrice}
              </span>
            )}
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-3 border-t pt-4">
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {t('product.size')}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError('');
                      }}
                      className={`px-3 py-1.5 text-xs border rounded-md transition-all duration-300 hover:scale-105 ${
                        selectedSize === size
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {sizeError && <p className="text-red-600 text-xs mt-1 animate-slideIn">{sizeError}</p>}
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  {t('product.color')}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setColorError('');
                      }}
                      className={`px-3 py-1.5 text-xs border rounded-md transition-all duration-300 hover:scale-105 ${
                        selectedColor === color
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                {colorError && <p className="text-red-600 text-xs mt-1 animate-slideIn">{colorError}</p>}
              </div>
            )}

            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-gray-700">{t('product.quantity')}:</label>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 p-0 text-xs"
                >
                  -
                </Button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 p-0 text-xs"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95 font-semibold text-sm"
              >
                {cartQuantity > 0 ? `${t('product.addMore')} (${cartQuantity} ${t('product.inCart')})` : t('product.addToCart')}
              </Button>
              <Button variant="outline" size="md" className="px-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Button>
            </div>

            {!product.inStock && (
              <p className="text-red-600 font-medium">{t('product.outOfStock')}</p>
            )}
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-xs font-medium text-gray-700 mb-1.5">{t('product.tags')}:</p>
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="info">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(product.material || product.care || product.origin || product.sku || product.brand) && (
            <div className="border-t pt-4">
              <button
                onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-sm font-semibold text-gray-900">{t('product.specifications')}</h3>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    isSpecsOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isSpecsOpen && (
                <div className="mt-3 space-y-2 animate-fadeIn">
                  <table className="w-full text-xs">
                    <tbody className="divide-y divide-gray-200">
                      {product.material && (
                        <tr>
                          <td className="py-1.5 pr-3 font-medium text-gray-700">{t('product.material')}</td>
                          <td className="py-1.5 text-gray-600">{product.material}</td>
                        </tr>
                      )}
                      {product.care && (
                        <tr>
                          <td className="py-1.5 pr-3 font-medium text-gray-700">{t('product.care')}</td>
                          <td className="py-1.5 text-gray-600">{product.care}</td>
                        </tr>
                      )}
                      {product.origin && (
                        <tr>
                          <td className="py-1.5 pr-3 font-medium text-gray-700">{t('product.origin')}</td>
                          <td className="py-1.5 text-gray-600">{product.origin}</td>
                        </tr>
                      )}
                      {product.sku && (
                        <tr>
                          <td className="py-1.5 pr-3 font-medium text-gray-700">{t('product.sku')}</td>
                          <td className="py-1.5 text-gray-600">{product.sku}</td>
                        </tr>
                      )}
                      {product.brand && (
                        <tr>
                          <td className="py-1.5 pr-3 font-medium text-gray-700">{t('product.brand')}</td>
                          <td className="py-1.5 text-gray-600">{product.brand}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="pt-2">
                      <Link
                        href="#size-guide"
                        className="text-sm text-primary-600 hover:text-primary-700 underline"
                      >
                        {t('product.sizeGuide')}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-4">
            <button
              onClick={() => setIsShippingOpen(!isShippingOpen)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-sm font-semibold text-gray-900">{t('product.shipping')} & {t('product.returns')}</h3>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isShippingOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isShippingOpen && (
              <div className="mt-3 space-y-2 text-xs text-gray-600 animate-fadeIn">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 mb-0.5">{t('product.estimatedDelivery')}</p>
                    <p>{language === 'vi' ? '3-5 ngày làm việc' : '3-5 business days'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 mb-0.5">{t('product.freeShipping')}</p>
                    <p>{language === 'vi' ? 'Cho đơn hàng trên 100$' : 'For orders over $100'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 mb-0.5">{t('product.returnPolicy')}</p>
                    <p>{language === 'vi' ? 'Đổi trả trong vòng 30 ngày' : '30-day return policy'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductReviews productId={id} reviews={reviews} averageRating={averageRating} />

      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('product.relatedProducts')}</h2>
          <ProductCarousel products={relatedProducts} title="" />
        </section>
      )}
    </div>
  );
}

