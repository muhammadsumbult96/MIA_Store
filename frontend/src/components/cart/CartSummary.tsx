"use client";

import { Cart } from "@/lib/api/cart";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface CartSummaryProps {
  cart: Cart;
  onCheckout?: () => void;
}

export default function CartSummary({ cart, onCheckout }: CartSummaryProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between text-secondary-600">
            <span>Items ({cart.total_items})</span>
            <span>{formatCurrency(Number(cart.total_price))}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(Number(cart.total_price))}</span>
          </div>
        </div>

        {onCheckout && (
          <Button className="w-full" size="lg" onClick={onCheckout}>
            Proceed to Checkout
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

