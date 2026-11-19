import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { CheckoutDraft } from '../types/campuscart';
import { formatINR, type CartSummary } from '../utils/commerce';

interface OrderReviewPageProps {
  draft: CheckoutDraft;
  summary: CartSummary;
  onEditOrder: () => void;
  onConfirmOrder: () => void;
}

export function OrderReviewPage({
  draft,
  summary,
  onEditOrder,
  onConfirmOrder,
}: OrderReviewPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-teal-700">
          Step 3 of 3 · Final Review Before WhatsApp Confirmation
        </p>
        <h1 className="font-display text-3xl font-bold text-slate-900">
          Review Your Order
        </h1>
        <p className="text-sm text-slate-600">
          Confirm your delivery details and essentials below. Clicking Confirm Order will
          record your order and generate your pre-filled WhatsApp message.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-200">
        {/* Customer & Delivery Details */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h2 className="font-display text-sm font-semibold text-slate-900">
              Customer Information
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Name</dt>
                <dd className="font-medium text-slate-900 text-right">{draft.fullName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Student ID</dt>
                <dd className="font-mono text-slate-900 text-right">{draft.studentId}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Phone</dt>
                <dd className="font-mono text-slate-900 text-right">{draft.phone}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-sm font-semibold text-slate-900">
              Scheduled Delivery
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Location</dt>
                <dd className="font-medium text-slate-900 text-right">
                  {draft.deliveryLocation}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Address / Block</dt>
                <dd className="text-slate-900 text-right">{draft.address}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Delivery Slot</dt>
                <dd className="font-semibold text-teal-700 text-right">
                  {draft.deliverySlot}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Ordered Products */}
        <div className="p-6 sm:p-8 space-y-4">
          <h2 className="font-display text-sm font-semibold text-slate-900">
            Ordered Products
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                  <th className="pb-2.5 font-medium">Product</th>
                  <th className="pb-2.5 font-medium text-right">Qty</th>
                  <th className="pb-2.5 font-medium text-right">Unit Price</th>
                  <th className="pb-2.5 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary.lineItems.map((item) => (
                  <tr key={item.productId}>
                    <td className="py-3 pr-4">
                      <span className="font-medium text-slate-900">
                        {item.productName}
                      </span>
                      <span className="text-xs text-slate-500 ml-2">{item.packSize}</span>
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums text-slate-800">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums text-slate-600">
                      {formatINR(item.unitPrice)}
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                      {formatINR(item.lineTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <dl className="pt-4 border-t border-slate-200 space-y-2 text-sm max-w-xs ml-auto">
            <div className="flex justify-between text-slate-600">
              <dt>Subtotal</dt>
              <dd className="font-mono tabular-nums text-slate-900">
                {formatINR(summary.subtotal)}
              </dd>
            </div>
            <div className="flex justify-between text-slate-600">
              <dt>Delivery charge</dt>
              <dd className="font-mono tabular-nums text-teal-700">₹0 / Included</dd>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
              <dt>Total Amount</dt>
              <dd className="font-mono tabular-nums">{formatINR(summary.grandTotal)}</dd>
            </div>
          </dl>
        </div>

        {/* Actions */}
        <div className="p-6 sm:p-8 bg-slate-50/70 rounded-b-2xl flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={onEditOrder}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Edit Order</span>
          </button>

          <button
            type="button"
            onClick={onConfirmOrder}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <span>Confirm Order</span>
          </button>
        </div>
      </div>
    </div>
  );
}
