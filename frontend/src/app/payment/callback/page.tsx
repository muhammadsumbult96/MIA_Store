"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function PaymentCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams();
        searchParams.forEach((value, key) => {
          params.append(key, value);
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/payments/callback?${params.toString()}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage("Payment successful! Your order has been confirmed.");
        } else {
          setStatus("failed");
          setMessage(data.message || "Payment verification failed.");
        }
      } catch (error) {
        setStatus("failed");
        setMessage("An error occurred while verifying payment.");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
              <p className="text-secondary-600">Please wait while we verify your payment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-semibold mb-2 text-green-600">Payment Successful!</h2>
              <p className="text-secondary-600 mb-6">{message}</p>
              <div className="space-y-2">
                <Link href="/account/orders" className="block">
                  <Button className="w-full">View Orders</Button>
                </Link>
                <Link href="/products" className="block">
                  <Button variant="outline" className="w-full">Continue Shopping</Button>
                </Link>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="text-red-500 text-6xl mb-4">✗</div>
              <h2 className="text-2xl font-semibold mb-2 text-red-600">Payment Failed</h2>
              <p className="text-secondary-600 mb-6">{message}</p>
              <div className="space-y-2">
                <Link href="/account/orders" className="block">
                  <Button variant="outline" className="w-full">View Orders</Button>
                </Link>
                <Link href="/products" className="block">
                  <Button className="w-full">Continue Shopping</Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

