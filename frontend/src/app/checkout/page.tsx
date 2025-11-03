"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useCart } from "@/hooks/useCart";
import { ordersApi, ShippingInfo } from "@/lib/api/orders";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading: cartLoading, refreshCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    shipping_name: "",
    shipping_phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_postal_code: "",
  });
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!cart || cart.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        items: cart.items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        shipping_info: shippingInfo,
        notes: notes || undefined,
      };

      const order = await ordersApi.createOrder(orderData);
      await refreshCart();
      router.push(`/account/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="mb-4">Your cart is empty</p>
            <Button onClick={() => router.push("/products")}>Continue Shopping</Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      value={shippingInfo.shipping_name}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, shipping_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={shippingInfo.shipping_phone}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, shipping_phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Address
                    </label>
                    <Input
                      value={shippingInfo.shipping_address}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, shipping_address: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        City
                      </label>
                      <Input
                        value={shippingInfo.shipping_city}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, shipping_city: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Postal Code
                      </label>
                      <Input
                        value={shippingInfo.shipping_postal_code}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            shipping_postal_code: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      className="flex h-24 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-secondary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Delivery instructions or special requests"
                    />
                  </div>
                </CardContent>
              </Card>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Subtotal</span>
                      <span>{formatCurrency(Number(cart.total_price))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                      <span>Total</span>
                      <span>{formatCurrency(Number(cart.total_price))}</span>
                    </div>
                  </div>

                  <p className="text-sm text-secondary-600 mb-4">
                    After placing your order, you will be redirected to complete payment.
                  </p>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Processing..." : "Place Order"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}

