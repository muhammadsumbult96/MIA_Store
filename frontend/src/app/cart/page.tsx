"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useCart } from "@/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { cart, loading } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {loading ? (
          <div className="text-center py-12">Loading cart...</div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary-600 mb-4">Your cart is empty</p>
            <Button onClick={() => router.push("/products")}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div>
              <CartSummary cart={cart} onCheckout={handleCheckout} />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

