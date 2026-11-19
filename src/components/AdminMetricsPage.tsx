import { useState, type FormEvent } from 'react';
import { BarChart3, Check, RotateCcw, Save } from 'lucide-react';
import { ORDER_STATUSES } from '../data/catalog';
import type { Order, OrderStatus, Product } from '../types/campuscart';
import { formatINR, type VentureMetrics } from '../utils/commerce';

interface AdminMetricsPageProps {
  metrics: VentureMetrics;
  orders: Order[];
  products: Product[];
  whatsappBusinessNumber: string;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onToggleProductAvailability: (productId: string, available: boolean) => void;
  onSaveWhatsAppNumber: (num: string) => void;
  onResetPrototypeData: () => void;
}

export function AdminMetricsPage({
  metrics,
  orders,
  products,
  whatsappBusinessNumber,
  onUpdateOrderStatus,
  onToggleProductAvailability,
  onSaveWhatsAppNumber,
  onResetPrototypeData,
}: AdminMetricsPageProps) {
  const [waNumber, setWaNumber] = useState(whatsappBusinessNumber);
  const [waSaved, setWaSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const maxSlotCount = Math.max(
    1,
    ...metrics.ordersBySlot.map((item) => item.count),
  );

  const earlyAccessPct = Math.min(
    100,
    Math.round((metrics.earlyAccessCount / metrics.earlyAccessTarget) * 100),
  );

  const handleSaveWa = (event: FormEvent) => {
    event.preventDefault();
    onSaveWhatsAppNumber(waNumber.trim() || 'WHATSAPP_BUSINESS_NUMBER');
    setWaSaved(true);
    window.setTimeout(() => setWaSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-teal-700">
            Prototype Venture Dashboard · Live Session Analytics
          </p>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Venture Metrics &amp; Admin
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Tracks real interactions recorded during this prototype session. Values begin
            at zero and update automatically as users onboard, place orders, and join
            early access.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {confirmReset ? (
            <div className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs">
              <span className="font-medium text-red-800">Reset all prototype data?</span>
              <button
                type="button"
                onClick={() => {
                  onResetPrototypeData();
                  setConfirmReset(false);
                  setWaNumber('WHATSAPP_BUSINESS_NUMBER');
                }}
                className="px-2.5 py-1 rounded bg-red-700 text-white font-semibold hover:bg-red-800 cursor-pointer"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2 py-1 text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Demo Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <section aria-label="Key venture metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1">
          <p className="text-xs text-slate-500">Registered Users</p>
          <p
            data-testid="metric-users"
            className="font-mono tabular-nums text-2xl font-bold text-slate-900"
          >
            {metrics.totalUsers}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1">
          <p className="text-xs text-slate-500">Total Orders</p>
          <p
            data-testid="metric-orders"
            className="font-mono tabular-nums text-2xl font-bold text-slate-900"
          >
            {metrics.totalOrders}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1">
          <p className="text-xs text-slate-500">Total Sales</p>
          <p
            data-testid="metric-sales"
            className="font-mono tabular-nums text-2xl font-bold text-slate-900"
          >
            {formatINR(metrics.totalSales)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1">
          <p className="text-xs text-slate-500">Average Order Value</p>
          <p
            data-testid="metric-aov"
            className="font-mono tabular-nums text-2xl font-bold text-slate-900"
          >
            {formatINR(metrics.averageOrderValue)}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-2">
          <p className="text-xs text-slate-500">Early Access (Target: 30)</p>
          <p
            data-testid="metric-early-access"
            className="font-mono tabular-nums text-2xl font-bold text-teal-800"
          >
            {metrics.earlyAccessCount} / {metrics.earlyAccessTarget}
          </p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-700 transition-all duration-300"
              style={{ width: `${earlyAccessPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* Secondary Operational Breakdown & Delivery Slot Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <h2 className="font-display text-base font-semibold text-slate-900">
            Operations Summary
          </h2>

          <dl className="divide-y divide-slate-100 text-sm">
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-600">Pending Orders (Order Placed)</dt>
              <dd className="font-mono tabular-nums font-semibold text-slate-900">
                {metrics.pendingOrders}
              </dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-600">Confirmed Orders</dt>
              <dd className="font-mono tabular-nums font-semibold text-slate-900">
                {metrics.confirmedOrders}
              </dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-600">Scheduled Orders</dt>
              <dd className="font-mono tabular-nums font-semibold text-slate-900">
                {metrics.scheduledOrders}
              </dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-600">Completed Orders (Delivered)</dt>
              <dd className="font-mono tabular-nums font-semibold text-teal-700">
                {metrics.completedOrders}
              </dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-600">Most Ordered Product</dt>
              <dd className="font-medium text-slate-900 text-right">
                {metrics.mostOrderedProduct
                  ? `${metrics.mostOrderedProduct.name} (${metrics.mostOrderedProduct.units} units)`
                  : 'No orders yet'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Orders by Scheduled Delivery Slot
            </h2>
            <BarChart3 className="w-4 h-4 text-teal-700" aria-hidden="true" />
          </div>

          <div className="space-y-4">
            {metrics.ordersBySlot.map((entry) => {
              const widthPct =
                metrics.totalOrders > 0
                  ? Math.round((entry.count / maxSlotCount) * 100)
                  : 0;
              return (
                <div key={entry.slot} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 font-medium">{entry.slot}</span>
                    <span className="font-mono tabular-nums text-xs font-semibold text-slate-900">
                      {entry.count} {entry.count === 1 ? 'order' : 'orders'}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-700 rounded-full transition-all duration-300"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Orders Management Table */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Order Management
            </h2>
            <p className="text-xs text-slate-500">
              Update order statuses to demonstrate fulfillment progression in My Orders.
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-600">
            {orders.length} total records
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No orders have been placed yet. Complete a student checkout to manage orders
            here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left text-xs text-slate-600">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Products</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount</th>
                  <th className="py-3 px-4 font-semibold">Delivery Location</th>
                  <th className="py-3 px-4 font-semibold">Delivery Slot</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-900 whitespace-nowrap">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-medium text-slate-900">{order.customerName}</p>
                      <p className="text-xs text-slate-500 font-mono">
                        {order.studentId}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700 min-w-[180px]">
                      {order.items
                        .map((item) => `${item.productName} × ${item.quantity}`)
                        .join(', ')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                      {formatINR(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-700 max-w-[200px]">
                      {order.deliveryLocation}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-800 whitespace-nowrap">
                      {order.deliverySlot}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <label htmlFor={`status-${order.id}`} className="sr-only">
                        Order status for {order.id}
                      </label>
                      <select
                        id={`status-${order.id}`}
                        value={order.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:border-teal-700"
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap font-mono tabular-nums">
                      {new Date(order.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Prototype Configuration: WhatsApp Business Number & Inventory Availability */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleSaveWa}
          className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
        >
          <div className="space-y-1">
            <h2 className="font-display text-base font-semibold text-slate-900">
              WhatsApp Business Number
            </h2>
            <p className="text-xs text-slate-600">
              Replace the configurable placeholder with your real WhatsApp number (with
              country code, e.g. 919876543210) when ready to take live orders.
            </p>
          </div>

          <div>
            <label
              htmlFor="admin-wa-number"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              WhatsApp Target Number
            </label>
            <input
              id="admin-wa-number"
              type="text"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="WHATSAPP_BUSINESS_NUMBER"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-mono text-slate-900 focus:border-teal-700"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
          >
            {waSaved ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Save WhatsApp Number</span>
              </>
            )}
          </button>
        </form>

        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Local Stock Availability (Sample Catalog)
            </h2>
            <p className="text-xs text-slate-600">
              Toggle availability for any sample essential to test out-of-stock handling
              in the catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs"
              >
                <span className="font-medium text-slate-800 truncate">
                  {product.name}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onToggleProductAvailability(product.id, !product.available)
                  }
                  className={`px-2.5 py-1 rounded font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    product.available
                      ? 'bg-teal-50 text-teal-800 hover:bg-teal-100'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  {product.available ? 'In Stock' : 'Unavailable'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
