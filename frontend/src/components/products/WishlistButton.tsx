"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { wishlistApi } from "@/lib/api/wishlist";
import Button from "@/components/ui/Button";

interface WishlistButtonProps {
  productId: number;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const { isAuthenticated } = useAuth();
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!isAuthenticated) {
        setChecking(false);
        return;
      }

      try {
        const response = await wishlistApi.checkWishlist(productId);
        setInWishlist(response.in_wishlist);
      } catch (error) {
        console.error("Failed to check wishlist:", error);
      } finally {
        setChecking(false);
      }
    };

    checkWishlist();
  }, [productId, isAuthenticated]);

  const handleToggle = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      if (inWishlist) {
        const wishlist = await wishlistApi.getWishlist();
        const item = wishlist.find((item) => item.product.id === productId);
        if (item) {
          await wishlistApi.removeFromWishlist(item.id);
          setInWishlist(false);
        }
      } else {
        await wishlistApi.addToWishlist(productId);
        setInWishlist(true);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || checking) {
    return null;
  }

  return (
    <Button
      variant={inWishlist ? "primary" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={loading}
    >
      {loading
        ? "..."
        : inWishlist
        ? "★ In Wishlist"
        : "☆ Add to Wishlist"}
    </Button>
  );
}

