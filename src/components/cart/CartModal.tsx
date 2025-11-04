'use client';

import { useCart } from '@/hooks/useCart';
import { Modal } from '@/components/ui/Modal';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { Button } from '@/components/ui/Button';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, clearCart } = useCart();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Shopping Cart" size="lg">
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-1 text-sm text-gray-500">Start shopping to add items to your cart.</p>
            <Button onClick={onClose} className="mt-4" variant="primary">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <CartSummary />
            <Button
              onClick={clearCart}
              variant="outline"
              className="w-full text-red-600 border-red-600 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}

