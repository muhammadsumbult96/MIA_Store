"use client";

import { useState } from "react";
import { paymentsApi } from "@/lib/api/payments";
import Button from "@/components/ui/Button";

interface PaymentButtonProps {
  orderNumber: string;
}

export default function PaymentButton({ orderNumber }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const returnUrl = `${window.location.origin}/payment/callback`;
      const response = await paymentsApi.createPayment({
        order_number: orderNumber,
        return_url: returnUrl,
      });

      window.location.href = response.payment_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Processing..." : "Pay with VNPay"}
      </Button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

