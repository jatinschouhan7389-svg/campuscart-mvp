import { CheckCircle2, ExternalLink, MessageCircle, Package, ShoppingBag } from 'lucide-react';
import type { Order, PageId } from '../types/campuscart';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  formatINR,
} from '../utils/commerce';

interface OrderSuccessPageProps {
  order: Order | null;
  whatsappBusinessNumber: string;
  onNavigate: (page: PageId) => void;
}

export function OrderSuccessPage({
  order,
  whatsappBusinessNumber,
  onNavigate,
}: OrderSuccessPageProps) {
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-slate-900">
          No recent order to display
        </h1>
        <button
          type="button"
          onClick={() => onNavigate('catalog')}
          className="px-5 py-2.5 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const whatsappUrl = buildWhatsAppUrl(
    buildWhatsAppOrderMessage(order),
    whatsappBusinessNumber,
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 space-y-8">
        <div className="space-y-3 text-center">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Order Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Your CampusCart order has been created successfully.
          </p>
        </div>

        <dl className="rounded-xl bg-slate-50 border border-slate-200 p-5 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Order ID</dt>
            <dd className="font-mono font-bold text-slate-900">{order.id}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Order Status</dt>
            <dd className="font-semibold text-teal-700">{order.status}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Total Amount</dt>
            <dd className="font-mono tabular-nums font-bold text-slate-900">
              {formatINR(order.totalAmount)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Delivery Slot</dt>
            <dd className="font-medium text-slate-900 text-right">
              {order.deliverySlot}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Delivery Location</dt>
            <dd className="text-slate-900 text-right">
              {order.deliveryLocation}
              {order.address ? ` — ${order.address}` : ''}
            </dd>
          </div>
        </dl>

        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#15803D] text-white text-sm font-semibold hover:bg-[#166534] transition-colors"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>Order via WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" aria-hidden="true" />
          </a>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onNavigate('orders')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
            >
              <Package className="w-4 h-4" aria-hidden="true" />
              <span>View My Orders</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" aria-hidden="true" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
