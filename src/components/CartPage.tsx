import { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import type { Product } from '../types/campuscart';
import { formatINR, type CartSummary } from '../utils/commerce';

interface CartPageProps {
  summary: CartSummary;
  products: Product[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export function CartPage({
  summary,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
}: CartPageProps) {
  const [emptyError, setEmptyError] = useState(false);

  const productMap = new Map(products.map((p) => [p.id, p]));

  const handleCheckout = () => {
    if (summary.itemCount <= 0) {
      setEmptyError(true);
      return;
    }
    setEmptyError(false);
    onProceedToCheckout();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-teal-700">Step 1 of 3 · Cart Review</p>
        <h1 className="font-display text-3xl font-bold text-slate-900">
          Your Shopping Cart
        </h1>
      </div>

      {emptyError && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-800 flex items-center gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-red-700" aria-hidden="true" />
          <span>Your cart is empty. Add an item before checkout.</span>
        </div>
      )}

      {summary.lineItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 mx-auto flex items-center justify-center text-slate-500">
            <ShoppingBag className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="font-display text-xl font-semibold text-slate-900">
            Your cart is empty
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Add cleaning or household essentials from the catalog to select a scheduled
            delivery slot.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onContinueShopping}
              className="px-5 py-2.5 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
            >
              Browse Essentials
            </button>
            <button
              type="button"
              onClick={handleCheckout}
              className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Item List */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 divide-y divide-slate-200">
            {summary.lineItems.map((item) => {
              const product = productMap.get(item.productId);
              return (
                <div
                  key={item.productId}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {product && (
                      <img
                        src={product.image}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-20 h-16 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                    )}
                    <div className="space-y-0.5">
                      <h2 className="font-display text-base font-semibold text-slate-900">
                        {item.productName}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {item.packSize} · Unit price:{' '}
                        <span className="font-mono tabular-nums text-slate-700">
                          {formatINR(item.unitPrice)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                        aria-label={`Decrease quantity of ${item.productName}`}
                        className="w-9 h-9 inline-flex items-center justify-center text-slate-700 hover:bg-slate-200/70 rounded-l-lg transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <span
                        data-testid={`cart-qty-${item.productId}`}
                        className="w-9 text-center font-mono tabular-nums text-sm font-semibold text-slate-900"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        aria-label={`Increase quantity of ${item.productName}`}
                        className="w-9 h-9 inline-flex items-center justify-center text-slate-700 hover:bg-slate-200/70 rounded-r-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    <p className="font-mono tabular-nums text-base font-bold text-slate-900 min-w-[68px] text-right">
                      {formatINR(item.lineTotal)}
                    </p>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.productId)}
                      aria-label={`Remove ${item.productName} from cart`}
                      className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Totals Card */}
          <aside className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Order Summary
            </h2>

            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <dt>Subtotal ({summary.itemCount} items)</dt>
                <dd className="font-mono tabular-nums font-medium text-slate-900">
                  {formatINR(summary.subtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <dt>Delivery charge</dt>
                <dd className="font-mono tabular-nums font-medium text-teal-700">
                  ₹0 / Included
                </dd>
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-base font-bold text-slate-900">
                <dt>Grand Total</dt>
                <dd data-testid="cart-grand-total" className="font-mono tabular-nums">
                  {formatINR(summary.grandTotal)}
                </dd>
              </div>
            </dl>

            <p className="text-xs text-slate-500 leading-relaxed">
              Fixed MVP delivery pricing—no dynamic surge fees. Select your preferred
              scheduled delivery slot on the next step.
            </p>

            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onContinueShopping}
                className="w-full px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
