import { useState } from 'react';
import { ArrowRight, Check, Copy, ExternalLink, MessageCircle } from 'lucide-react';
import type { Order } from '../types/campuscart';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  formatINR,
} from '../utils/commerce';

interface WhatsAppOrderPageProps {
  order: Order | null;
  whatsappBusinessNumber: string;
  onContinueToSuccess: () => void;
  onViewOrders: () => void;
}

export function WhatsAppOrderPage({
  order,
  whatsappBusinessNumber,
  onContinueToSuccess,
  onViewOrders,
}: WhatsAppOrderPageProps) {
  const [copied, setCopied] = useState(false);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          No active order found
        </h1>
        <button
          type="button"
          onClick={onViewOrders}
          className="px-5 py-2.5 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
        >
          View My Orders
        </button>
      </div>
    );
  }

  const message = buildWhatsAppOrderMessage(order);
  const whatsappUrl = buildWhatsAppUrl(message, whatsappBusinessNumber);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-teal-700">
          WhatsApp Order Confirmation · Campus-Adjacent Scheduled Delivery
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
          Your CampusCart order is ready!
        </h1>
        <p className="text-sm text-slate-600">
          Send your pre-filled order message on WhatsApp to confirm your delivery slot.
          You do not need to retype any details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Order Summary */}
        <section className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
            <div>
              <p className="text-xs text-slate-500">Order ID</p>
              <p
                data-testid="whatsapp-order-id"
                className="font-mono text-base font-bold text-slate-900"
              >
                {order.id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Order Status</p>
              <p className="text-sm font-semibold text-teal-700">{order.status}</p>
            </div>
          </div>

          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Customer Name</dt>
              <dd className="font-medium text-slate-900 text-right">
                {order.customerName}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Student ID</dt>
              <dd className="font-mono text-slate-900 text-right">{order.studentId}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Delivery Location</dt>
              <dd className="text-slate-900 text-right">
                {order.deliveryLocation}
                {order.address ? ` — ${order.address}` : ''}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Delivery Slot</dt>
              <dd className="font-semibold text-teal-700 text-right">
                {order.deliverySlot}
              </dd>
            </div>
          </dl>

          <div className="pt-3.5 border-t border-slate-100 space-y-2">
            <p className="text-xs font-medium text-slate-500">Ordered Products</p>
            <ul className="space-y-1.5 text-sm">
              {order.items.map((item) => (
                <li key={item.productId} className="flex justify-between gap-3">
                  <span className="text-slate-800">
                    {item.productName}{' '}
                    <span className="text-slate-500 font-mono">x {item.quantity}</span>
                  </span>
                  <span className="font-mono tabular-nums font-medium text-slate-900">
                    {formatINR(item.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-3 mt-2 border-t border-slate-200 flex justify-between text-base font-bold text-slate-900">
              <span>Total Amount</span>
              <span className="font-mono tabular-nums">
                {formatINR(order.totalAmount)}
              </span>
            </div>
          </div>
        </section>

        {/* Pre-filled WhatsApp Message & Action */}
        <section className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Pre-filled WhatsApp Message
            </h2>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-700" aria-hidden="true" />
                  <span className="text-teal-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Copy text</span>
                </>
              )}
            </button>
          </div>

          <pre
            data-testid="whatsapp-message-preview"
            className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-snug max-h-[290px] overflow-y-auto"
          >
            {message}
          </pre>

          <p className="text-xs text-slate-500">
            Destination number:{' '}
            <code className="font-mono text-slate-700">{whatsappBusinessNumber}</code>{' '}
            (configurable in Venture Metrics &amp; Admin).
          </p>

          <div className="space-y-2.5 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="whatsapp-order-link"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#15803D] text-white text-sm font-semibold hover:bg-[#166534] transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Order via WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={onContinueToSuccess}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>Continue to Order Confirmation</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
