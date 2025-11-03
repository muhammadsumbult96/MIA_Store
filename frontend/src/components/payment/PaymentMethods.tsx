"use client";

import { useState } from "react";
import { paymentsApi } from "@/lib/api/payments";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface PaymentMethodsProps {
  orderNumber: string;
  amount: number;
  onPaymentInitiated?: () => void;
}

export default function PaymentMethods({
  orderNumber,
  amount,
  onPaymentInitiated,
}: PaymentMethodsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVNPayPayment = async () => {
    try {
      setLoading(true);
      setError("");

      const returnUrl = `${window.location.origin}/payment/callback`;
      const response = await paymentsApi.createPayment({
        order_number: orderNumber,
        return_url: returnUrl,
      });

      if (onPaymentInitiated) {
        onPaymentInitiated();
      }

      window.location.href = response.payment_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <button
            onClick={handleVNPayPayment}
            disabled={loading}
            className="w-full p-4 border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                  VNPay
                </div>
                <div className="text-left">
                  <p className="font-semibold">VNPay</p>
                  <p className="text-sm text-secondary-600">
                    Pay securely with VNPay
                  </p>
                </div>
              </div>
              {loading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
              )}
            </div>
          </button>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-sm text-secondary-600">
            Total amount: <span className="font-semibold">{amount.toLocaleString("vi-VN")} VND</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

