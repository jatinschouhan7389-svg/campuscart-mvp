import { ExternalLink, MessageCircle, Package } from 'lucide-react';
import type { Order, OrderStatus, PageId } from '../types/campuscart';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  formatINR,
} from '../utils/commerce';

interface MyOrdersPageProps {
  orders: Order[];
  whatsappBusinessNumber: string;
  onNavigate: (page: PageId) => void;
}

function getStatusTextClass(status: OrderStatus): string {
  switch (status) {
    case 'Delivered':
      return 'text-teal-800 font-semibold';
    case 'Scheduled':
    case 'Confirmed':
      return 'text-blue-700 font-semibold';
    case 'Cancelled':
      return 'text-red-700 font-semibold';
    default:
      return 'text-amber-800 font-semibold';
  }
}

export function MyOrdersPage({
  orders,
  whatsappBusinessNumber,
  onNavigate,
}: MyOrdersPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <p className="text-xs font-medium text-teal-700">
            Student Order History · Local Scheduled Delivery
          </p>
          <h1 className="font-display text-3xl font-bold text-slate-900">My Orders</h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('catalog')}
          className="px-4 py-2.5 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
        >
          Shop Essentials
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 mx-auto flex items-center justify-center text-slate-500">
            <Package className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="font-display text-xl font-semibold text-slate-900">
            No orders placed yet
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Browse household and cleaning essentials, choose a scheduled delivery slot,
            and confirm via WhatsApp to see your orders listed here.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="mt-2 px-5 py-2.5 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
          >
            Browse Essentials
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            const whatsappUrl = buildWhatsAppUrl(
              buildWhatsAppOrderMessage(order),
              whatsappBusinessNumber,
            );
            return (
              <article
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {order.id}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{formattedDate}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {order.deliveryLocation}
                      {order.address ? ` — ${order.address}` : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="text-slate-600">
                      Slot: <strong className="text-slate-900">{order.deliverySlot}</strong>
                    </span>
                    <span aria-hidden="true" className="text-slate-300">
                      |
                    </span>
                    <span className={getStatusTextClass(order.status)}>
                      Status: {order.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                  <ul className="space-y-1.5 text-sm text-slate-700">
                    {order.items.map((item) => (
                      <li key={item.productId}>
                        <span className="font-medium text-slate-900">
                          {item.productName}
                        </span>{' '}
                        <span className="text-slate-500">
                          ({item.packSize}) × {item.quantity}
                        </span>{' '}
                        —{' '}
                        <span className="font-mono tabular-nums text-slate-800">
                          {formatINR(item.lineTotal)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-slate-500">Total Amount</p>
                      <p className="font-mono tabular-nums text-lg font-bold text-slate-900">
                        {formatINR(order.totalAmount)}
                      </p>
                    </div>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#15803D]" aria-hidden="true" />
                      <span>WhatsApp Details</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
