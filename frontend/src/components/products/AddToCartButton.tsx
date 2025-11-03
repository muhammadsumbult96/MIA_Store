"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useCart } from "@/hooks/useCart";
import Button from "@/components/ui/Button";

interface AddToCartButtonProps {
  productId: number;
  stockQuantity: number;
}

export default function AddToCartButton({ productId, stockQuantity }: AddToCartButtonProps) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    try {
      setLoading(true);
      await addToCart({ product_id: productId, quantity: 1 });
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="w-full"
      size="lg"
      disabled={stockQuantity === 0 || loading}
      onClick={handleAddToCart}
    >
      {loading ? "Adding..." : stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}

