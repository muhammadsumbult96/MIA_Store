import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/api/products";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const displayPrice = product.discounted_price || product.price;
  const originalPrice = product.discounted_price ? product.price : null;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative aspect-square w-full">
          {primaryImage ? (
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-secondary-200 flex items-center justify-center">
              <span className="text-secondary-400">No image</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-primary-600 font-bold">
              {formatCurrency(Number(displayPrice))}
            </span>
            {originalPrice && (
              <span className="text-secondary-400 line-through text-sm">
                {formatCurrency(Number(originalPrice))}
              </span>
            )}
          </div>
          {product.stock_quantity === 0 && (
            <span className="text-red-500 text-sm mt-2 block">Out of stock</span>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

