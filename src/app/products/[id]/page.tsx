'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { sampleProducts } from '@/lib/constants/products';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/useToast';
import { formatPrice, formatVND, calculateDiscount } from '@/lib/utils/format';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductCarousel } from '@/components/product/ProductCarousel';
import { useLanguage } from '@/hooks/useLanguage';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = sampleProducts.find((p) => p.id === params.id);
  const { addItem, getItemQuantity } = useCart();
  const { showToast } = useToast();
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

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
  const cartQuantity = getItemQuantity(product.id);
  const relatedProducts = sampleProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity);
    showToast(`${quantity} x ${product.name} added to cart!`, 'success');
    setQuantity(1);
  };

  const handleImageZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
        <div className="space-y-4">
          <div
            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleImageZoom}
          >
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300"
              style={{
                transform: isZoomed
                  ? `scale(2) translate(${-zoomPosition.x}%, ${-zoomPosition.y}%)`
                  : 'scale(1)',
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
            {discount > 0 && (
              <Badge variant="error" className="absolute top-4 left-4">
                -{discount}%
              </Badge>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-primary-600'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="ml-1 text-gray-700">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-gray-900">
              {displayPrice}
            </span>
            {displayOriginalPrice && (
              <span className="text-xl text-gray-500 line-through">
                {displayOriginalPrice}
              </span>
            )}
          </div>

          <div className="border-t pt-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 p-0"
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 p-0"
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1"
              >
                {cartQuantity > 0 ? `Add More (${cartQuantity} in cart)` : 'Add to Cart'}
              </Button>
              <Button variant="outline" size="lg" className="px-6">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <p className="text-red-600 font-medium">Out of Stock</p>
            )}
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="border-t pt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="info">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <ProductCarousel products={relatedProducts} title="" />
        </section>
      )}
    </div>
  );
}

