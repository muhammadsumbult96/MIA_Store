"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ordersApi, Order } from "@/lib/api/orders";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import Button from "@/components/ui/Button";
import PaymentButton from "@/components/payment/PaymentButton";

export default function OrderDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await ordersApi.getOrder(id);
        setOrder(data);
      } catch (err) {
        setError("Order not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "text-yellow-600 bg-yellow-50",
      confirmed: "text-blue-600 bg-blue-50",
      processing: "text-purple-600 bg-purple-50",
      shipped: "text-indigo-600 bg-indigo-50",
      delivered: "text-green-600 bg-green-50",
      cancelled: "text-red-600 bg-red-50",
    };
    return colors[status] || "text-secondary-600 bg-secondary-50";
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading order...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !order) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error || "Order not found"}</div>
          <div className="text-center mt-4">
            <Link href="/account/orders">
              <Button>Back to Orders</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/account/orders">
            <Button variant="ghost">← Back to Orders</Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Order #{order.order_number}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start pb-4 border-b last:border-0"
                    >
                      <div>
                        <p className="font-semibold">{item.product_name}</p>
                        <p className="text-sm text-secondary-600">SKU: {item.product_sku}</p>
                        <p className="text-sm text-secondary-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatCurrency(Number(item.total_price))}
                        </p>
                        <p className="text-sm text-secondary-600">
                          {formatCurrency(Number(item.unit_price))} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <span className="font-semibold">Name:</span> {order.shipping_name}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {order.shipping_phone}
                </p>
                <p>
                  <span className="font-semibold">Address:</span> {order.shipping_address}
                </p>
                <p>
                  <span className="font-semibold">City:</span> {order.shipping_city}
                </p>
                {order.shipping_postal_code && (
                  <p>
                    <span className="font-semibold">Postal Code:</span> {order.shipping_postal_code}
                  </p>
                )}
              </CardContent>
            </Card>

            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-600">{order.notes}</p>
                </CardContent>
              </Card>
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
                    <span>{formatCurrency(Number(order.subtotal))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Shipping</span>
                    <span>{formatCurrency(Number(order.shipping_fee))}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(Number(order.total))}</span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div>
                    <p className="text-sm text-secondary-600 mb-1">Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600 mb-1">Payment</p>
                    <span className="text-sm font-medium capitalize">{order.payment_status}</span>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600 mb-1">Order Date</p>
                    <p className="text-sm">{formatDate(order.created_at)}</p>
                  </div>
                  {order.payment_status === "pending" && (
                    <div className="pt-4 border-t">
                      <PaymentButton orderNumber={order.order_number} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

