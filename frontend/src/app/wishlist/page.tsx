"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { wishlistApi, WishlistItem } from "@/lib/api/wishlist";
import ProductGrid from "@/components/products/ProductGrid";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const data = await wishlistApi.getWishlist();
        setWishlist(data);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (itemId: number) => {
    try {
      await wishlistApi.removeFromWishlist(itemId);
      setWishlist(wishlist.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading wishlist...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {wishlist.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-secondary-600 mb-4">Your wishlist is empty</p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <ProductGrid products={wishlist.map((item) => item.product)} />
        )}
      </div>
    </ProtectedRoute>
  );
}

