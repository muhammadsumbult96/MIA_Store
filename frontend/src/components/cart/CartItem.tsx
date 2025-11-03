"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem as CartItemType } from "@/lib/api/cart";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const primaryImage = item.product.images?.find((img) => img.is_primary) || item.product.images?.[0];
  const displayPrice = Number(item.product.discounted_price || item.product.price);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-secondary-200">
      <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 bg-secondary-100 rounded-lg overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || item.product.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-secondary-400 text-xs">No image</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1">
        <Link href={`/products/${item.product.slug}`}>
          <h3 className="font-semibold hover:text-primary-600">{item.product.name}</h3>
        </Link>
        <p className="text-sm text-secondary-600 mt-1">
          {formatCurrency(displayPrice)} each
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </Button>
            <span className="w-12 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= (item.product.stock_quantity || 0)}
            >
              +
            </Button>
          </div>

          <div className="text-right">
            <p className="font-semibold">
              {formatCurrency(displayPrice * item.quantity)}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.id)}
              className="text-red-600 hover:text-red-700 mt-1"
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

