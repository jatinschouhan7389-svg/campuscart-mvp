import { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  Check,
  Minus,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import type { Product } from '../types/campuscart';
import { formatINR } from '../utils/commerce';
import { ProductImage } from './ProductImage';

interface ProductDetailPageProps {
  product: Product | null;
  onBackToCatalog: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenCart: () => void;
}

export function ProductDetailPage({
  product,
  onBackToCatalog,
  onAddToCart,
  onOpenCart,
}: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          Product not found
        </h1>
        <button
          type="button"
          onClick={onBackToCatalog}
          className="px-5 py-2.5 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
        >
          Return to Essentials Catalog
        </button>
      </div>
    );
  }

  const handleAdd = () => {
    if (!product.available) {
      setStatusMessage({
        type: 'error',
        text: 'Sorry, this product is currently unavailable.',
      });
      return;
    }
    onAddToCart(product, quantity);
    setStatusMessage({
      type: 'success',
      text: `${product.name} (${quantity}) added to your cart.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        type="button"
        onClick={onBackToCatalog}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Product Catalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Product Image */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <ProductImage src={product.image} alt={product.name} />
        </div>

        {/* Contiguous Purchase Module */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>Pack Size: {product.packSize}</span>
              <span aria-hidden="true">·</span>
              <span>Sample MVP Data</span>
            </div>

            <h1 className="font-display text-3xl font-bold text-slate-900">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 pt-1">
              <span className="font-mono tabular-nums text-2xl font-bold text-slate-900">
                {formatINR(product.price)}
              </span>
              <span
                className={`text-sm font-medium ${
                  product.available ? 'text-teal-700' : 'text-red-700'
                }`}
              >
                {product.available
                  ? 'Available locally in Dehradun'
                  : 'Currently Unavailable'}
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Scheduled Delivery Callout */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-3">
            <CalendarClock
              className="w-5 h-5 text-teal-700 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-slate-900">
                Need it soon? Choose a scheduled delivery slot at checkout.
              </p>
              <p className="text-xs text-slate-600">
                Campus-adjacent delivery for DGU hostels &amp; nearby residential blocks ·
                Fixed ₹0 MVP delivery charge.
              </p>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-800">Quantity</span>
              <div className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-10 inline-flex items-center justify-center text-slate-700 hover:bg-slate-200/70 rounded-l-lg transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span
                  data-testid="detail-quantity"
                  className="w-12 text-center font-mono tabular-nums text-sm font-semibold text-slate-900"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                  aria-label="Increase quantity"
                  className="w-10 h-10 inline-flex items-center justify-center text-slate-700 hover:bg-slate-200/70 rounded-r-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  product.available
                    ? 'bg-teal-700 text-white hover:bg-teal-800'
                    : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
                }`}
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span>
                  {product.available
                    ? `Add to Cart · ${formatINR(product.price * quantity)}`
                    : 'Currently Unavailable'}
                </span>
              </button>

              {statusMessage?.type === 'success' && (
                <button
                  type="button"
                  onClick={onOpenCart}
                  className="px-5 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Go to Cart
                </button>
              )}
            </div>

            {statusMessage && (
              <div
                role={statusMessage.type === 'error' ? 'alert' : 'status'}
                className={`rounded-lg px-4 py-3 text-sm flex items-center gap-2.5 border ${
                  statusMessage.type === 'error'
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-teal-50 border-teal-200 text-teal-900'
                }`}
              >
                {statusMessage.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-700" aria-hidden="true" />
                ) : (
                  <Check className="w-4 h-4 shrink-0 text-teal-700" aria-hidden="true" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
