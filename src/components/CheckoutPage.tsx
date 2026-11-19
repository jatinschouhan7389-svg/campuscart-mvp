import { useState, type FormEvent } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, CalendarClock } from 'lucide-react';
import { DELIVERY_LOCATIONS, DELIVERY_SLOTS } from '../data/catalog';
import type { CheckoutDraft, DeliverySlot } from '../types/campuscart';
import {
  formatINR,
  validateCheckoutForm,
  type CartSummary,
  type ValidationErrors,
} from '../utils/commerce';

interface CheckoutPageProps {
  draft: CheckoutDraft;
  summary: CartSummary;
  onChangeDraft: (draft: CheckoutDraft) => void;
  onBackToCart: () => void;
  onReviewOrder: (draft: CheckoutDraft) => void;
  onShopNow: () => void;
}

export function CheckoutPage({
  draft,
  summary,
  onChangeDraft,
  onBackToCart,
  onReviewOrder,
  onShopNow,
}: CheckoutPageProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const updateField = <K extends keyof CheckoutDraft>(
    key: K,
    value: CheckoutDraft[K],
  ) => {
    const next = { ...draft, [key]: value };
    onChangeDraft(next);
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validation = validateCheckoutForm(draft, summary.itemCount);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    onReviewOrder(draft);
  };

  if (summary.itemCount <= 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center space-y-4">
        <div
          role="alert"
          className="rounded-xl bg-red-50 border border-red-200 p-5 text-sm font-medium text-red-800 flex items-center justify-center gap-2.5"
        >
          <AlertCircle className="w-5 h-5 shrink-0 text-red-700" aria-hidden="true" />
          <span>Your cart is empty. Add an item before checkout.</span>
        </div>
        <button
          type="button"
          onClick={onShopNow}
          className="px-5 py-2.5 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
        >
          Shop Essentials
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-teal-700">
            Step 2 of 3 · Delivery Details &amp; Scheduled Slot
          </p>
          <h1 className="font-display text-3xl font-bold text-slate-900">Checkout</h1>
        </div>
        <button
          type="button"
          onClick={onBackToCart}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-teal-700 transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Cart</span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        <div className="lg:col-span-8 space-y-8">
          {/* Customer & Location Information */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Customer &amp; Delivery Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="chk-fullName"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="chk-fullName"
                  type="text"
                  value={draft.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  aria-invalid={Boolean(errors.fullName)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                />
                {errors.fullName && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="chk-phone"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  Phone Number
                </label>
                <input
                  id="chk-phone"
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="10-digit WhatsApp number"
                  aria-invalid={Boolean(errors.phone)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                />
                {errors.phone && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="chk-studentId"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  DGU Student ID / Roll Number
                </label>
                <input
                  id="chk-studentId"
                  type="text"
                  value={draft.studentId}
                  onChange={(e) => updateField('studentId', e.target.value)}
                  placeholder="e.g. DGU-MBA-2601"
                  aria-invalid={Boolean(errors.studentId)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                />
                {errors.studentId && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                    {errors.studentId}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="chk-location"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  Delivery Location
                </label>
                <select
                  id="chk-location"
                  value={draft.deliveryLocation}
                  onChange={(e) => updateField('deliveryLocation', e.target.value)}
                  aria-invalid={Boolean(errors.deliveryLocation)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                >
                  <option value="">Select campus housing or nearby block</option>
                  {DELIVERY_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                {errors.deliveryLocation && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                    {errors.deliveryLocation}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="chk-address"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Address / Room Number / Nearby Residential Block
              </label>
              <input
                id="chk-address"
                type="text"
                value={draft.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="e.g. Room 204, Block B, Main Hostel Gate"
                aria-invalid={Boolean(errors.address)}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
              />
              {errors.address && (
                <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                  {errors.address}
                </p>
              )}
            </div>
          </section>

          {/* Scheduled Delivery Slot */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-900">
                  <CalendarClock className="w-5 h-5 text-teal-700" aria-hidden="true" />
                  <h2 className="font-display text-lg font-semibold">
                    Scheduled Delivery Slot
                  </h2>
                </div>
                <p className="text-xs text-slate-600">
                  Campus-adjacent scheduled drop-off in Dehradun. Choose one convenient
                  slot below.
                </p>
              </div>
              <span className="text-xs font-medium text-teal-700 whitespace-nowrap">
                ₹0 / Included
              </span>
            </div>

            <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <legend className="sr-only">Select a scheduled delivery slot</legend>
              {DELIVERY_SLOTS.map((option) => {
                const selected = draft.deliverySlot === option.slot;
                return (
                  <label
                    key={option.slot}
                    className={`relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-colors ${
                      selected
                        ? 'border-teal-700 bg-teal-50/60'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliverySlot"
                      value={option.slot}
                      checked={selected}
                      onChange={() =>
                        updateField('deliverySlot', option.slot as DeliverySlot)
                      }
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-semibold text-slate-900">
                        {option.slot}
                      </span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          selected ? 'border-teal-700 bg-teal-700' : 'border-slate-300'
                        }`}
                        aria-hidden="true"
                      >
                        {selected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-teal-800 mt-1">
                      {option.window}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">{option.detail}</p>
                  </label>
                );
              })}
            </fieldset>

            {errors.deliverySlot && (
              <p role="alert" className="text-xs font-medium text-red-700">
                {errors.deliverySlot}
              </p>
            )}
          </section>
        </div>

        {/* Summary Sidebar */}
        <aside className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Items ({summary.itemCount})
          </h2>

          <ul className="divide-y divide-slate-100 text-sm">
            {summary.lineItems.map((item) => (
              <li
                key={item.productId}
                className="py-2.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">{item.productName}</p>
                  <p className="text-xs text-slate-500">
                    Qty {item.quantity} · {item.packSize}
                  </p>
                </div>
                <span className="font-mono tabular-nums text-slate-900 font-medium shrink-0">
                  {formatINR(item.lineTotal)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="pt-3 border-t border-slate-200 space-y-2 text-sm">
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
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-base">
              <dt>Grand Total</dt>
              <dd className="font-mono tabular-nums">{formatINR(summary.grandTotal)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
          >
            <span>Review Order</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </aside>
      </form>
    </div>
  );
}
