"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { productsApi, Product } from "@/lib/api/products";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import AddToCartButton from "@/components/products/AddToCartButton";
import ImageZoom from "@/components/products/ImageZoom";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productsApi.getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error || "Product not found"}</div>
      </div>
    );
  }

  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const displayPrice = product.discounted_price || product.price;
  const originalPrice = product.discounted_price ? product.price : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {product.images && product.images.length > 0 ? (
            <div className="space-y-4">
              <div className="relative aspect-square w-full bg-secondary-100 rounded-lg overflow-hidden">
                <ImageZoom
                  src={product.images[selectedImageIndex]?.image_url || primaryImage?.image_url || ""}
                  alt={product.images[selectedImageIndex]?.alt_text || product.name}
                  className="w-full h-full"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index
                          ? "border-primary-500"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        src={image.image_url}
                        alt={image.alt_text || product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 25vw, 12.5vw"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square w-full bg-secondary-200 rounded-lg flex items-center justify-center">
              <span className="text-secondary-400">No image available</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-primary-600">
                {formatCurrency(Number(displayPrice))}
              </span>
              {originalPrice && (
                <span className="text-xl text-secondary-400 line-through">
                  {formatCurrency(Number(originalPrice))}
                </span>
              )}
            </div>
            <p className="text-secondary-600">SKU: {product.sku}</p>
          </div>

          {product.description && (
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-secondary-600 whitespace-pre-wrap">{product.description}</p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div>
              <p className="text-sm text-secondary-600 mb-2">
                Stock: {product.stock_quantity > 0 ? `${product.stock_quantity} available` : "Out of stock"}
              </p>
            </div>
            <AddToCartButton productId={product.id} stockQuantity={product.stock_quantity} />
          </div>
        </div>
      </div>
    </div>
  );
}

