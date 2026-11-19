import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, ClipboardCheck } from 'lucide-react';
import {
  DELIVERY_LOCATIONS,
  DELIVERY_SLOTS,
  EARLY_ACCESS_TARGET,
} from '../data/catalog';
import type { DeliverySlot, PageId, Product, UserProfile } from '../types/campuscart';
import {
  validateEarlyAccessForm,
  type EarlyAccessInput,
  type ValidationErrors,
} from '../utils/commerce';

interface EarlyAccessPageProps {
  products: Product[];
  earlyAccessCount: number;
  activeProfile: UserProfile | null;
  onSubmitEarlyAccess: (input: EarlyAccessInput) => void;
  onNavigate: (page: PageId) => void;
}

export function EarlyAccessPage({
  products,
  earlyAccessCount,
  activeProfile,
  onSubmitEarlyAccess,
  onNavigate,
}: EarlyAccessPageProps) {
  const [form, setForm] = useState<EarlyAccessInput>({
    name: activeProfile?.fullName ?? '',
    studentId: activeProfile?.studentId ?? '',
    phone: activeProfile?.phone ?? '',
    residentialLocation: activeProfile?.preferredLocation ?? '',
    preferredProduct: 'Surface Cleaner',
    preferredDeliveryTime: 'Today — Evening',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const progressPercent = Math.min(
    100,
    Math.round((earlyAccessCount / EARLY_ACCESS_TARGET) * 100),
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const validation = validateEarlyAccessForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    onSubmitEarlyAccess(form);
    setSubmitted(true);
    setForm({
      name: '',
      studentId: '',
      phone: '',
      residentialLocation: '',
      preferredProduct: 'Surface Cleaner',
      preferredDeliveryTime: 'Today — Evening',
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Validation Context & Live Counter */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-medium text-teal-700">
              Venture Validation Prototype
            </p>
            <h1 className="font-display text-3xl font-bold text-slate-900">
              CampusCart Early Access
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We are testing CampusCart with DGU residential students. Join the early
              access list and help us validate the service.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                Early Access Sign-ups
              </span>
              <ClipboardCheck className="w-5 h-5 text-teal-700" aria-hidden="true" />
            </div>

            <p
              data-testid="early-access-counter"
              className="font-mono tabular-nums text-4xl font-bold text-slate-900"
            >
              {earlyAccessCount} / {EARLY_ACCESS_TARGET}
            </p>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-700 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Validation Objective: Test whether at least 30 residential students will
              pre-book and pay for cleaning essentials in advance using a simple WhatsApp
              ordering workflow.
            </p>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
              >
                <span>Open Venture Metrics &amp; Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Early Access Form */}
        <div className="lg:col-span-7">
          {submitted && (
            <div
              role="status"
              className="mb-6 rounded-xl bg-teal-50 border border-teal-200 p-5 flex items-start gap-3"
            >
              <CheckCircle2
                className="w-5 h-5 text-teal-700 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-teal-900">
                  Thank you! Your interest has been recorded.
                </p>
                <p className="text-xs text-teal-800">
                  Your sign-up has updated the CampusCart prototype validation counter (
                  {earlyAccessCount} / {EARLY_ACCESS_TARGET}).
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5"
          >
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Register Your Interest
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="ea-name"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  Name
                </label>
                <input
                  id="ea-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  aria-invalid={Boolean(errors.name)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                />
                {errors.name && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="ea-studentId"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  Student ID
                </label>
                <input
                  id="ea-studentId"
                  type="text"
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
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
                  htmlFor="ea-phone"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  Phone
                </label>
                <input
                  id="ea-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                  htmlFor="ea-location"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  Residential Location
                </label>
                <select
                  id="ea-location"
                  value={form.residentialLocation}
                  onChange={(e) =>
                    setForm({ ...form, residentialLocation: e.target.value })
                  }
                  aria-invalid={Boolean(errors.residentialLocation)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                >
                  <option value="">Select residential area</option>
                  {DELIVERY_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                {errors.residentialLocation && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                    {errors.residentialLocation}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="ea-product"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  Preferred Essential Product
                </label>
                <select
                  id="ea-product"
                  value={form.preferredProduct}
                  onChange={(e) =>
                    setForm({ ...form, preferredProduct: e.target.value })
                  }
                  aria-invalid={Boolean(errors.preferredProduct)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.name}>
                      {product.name} ({product.packSize})
                    </option>
                  ))}
                </select>
                {errors.preferredProduct && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                    {errors.preferredProduct}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="ea-slot"
                  className="block text-sm font-medium text-slate-800 mb-1.5"
                >
                  Preferred Delivery Time
                </label>
                <select
                  id="ea-slot"
                  value={form.preferredDeliveryTime}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      preferredDeliveryTime: e.target.value as DeliverySlot,
                    })
                  }
                  aria-invalid={Boolean(errors.preferredDeliveryTime)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
                >
                  <option value="">Select a delivery slot</option>
                  {DELIVERY_SLOTS.map((item) => (
                    <option key={item.slot} value={item.slot}>
                      {item.slot} ({item.window})
                    </option>
                  ))}
                </select>
                {errors.preferredDeliveryTime && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                    {errors.preferredDeliveryTime}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
              >
                Join Early Access
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
