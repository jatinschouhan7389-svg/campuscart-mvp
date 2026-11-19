import { ArrowRight, CalendarClock, MessageCircle, Search, ShoppingBag } from 'lucide-react';
import { DELIVERY_LOCATIONS } from '../data/catalog';
import type { PageId } from '../types/campuscart';

interface HowItWorksPageProps {
  onNavigate: (page: PageId) => void;
}

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Browse Essentials',
    description: 'Find cleaning and household essentials available locally.',
  },
  {
    number: '02',
    icon: ShoppingBag,
    title: 'Add to Cart',
    description: 'Select what you need and review your order.',
  },
  {
    number: '03',
    icon: CalendarClock,
    title: 'Choose Delivery Slot',
    description: 'Select a convenient scheduled delivery time.',
  },
  {
    number: '04',
    icon: MessageCircle,
    title: 'Confirm via WhatsApp',
    description: 'Send your order details through WhatsApp for confirmation.',
  },
];

const VENTURE_FLOW = [
  'Student needs essential',
  'Opens CampusCart',
  'Finds local product',
  'Adds to cart',
  'Selects delivery slot',
  'Confirms via WhatsApp',
  'Campus-adjacent drop-off',
  'Time & travel saved',
];

export function HowItWorksPage({ onNavigate }: HowItWorksPageProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <section className="max-w-3xl space-y-3">
        <p className="text-xs font-medium text-teal-700">
          Campus-Adjacent Scheduled Delivery + WhatsApp Ordering
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          How CampusCart Works
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Built specifically for DGU 1st and 2nd Year MBA students without personal
          vehicles. Get essential cleaning products in four fast steps without travelling
          to distant Dehradun markets.
        </p>
      </section>

      {/* 4 Steps */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-teal-700">
                  Step {step.number}
                </span>
                <Icon className="w-5 h-5 text-slate-700" aria-hidden="true" />
              </div>
              <div className="space-y-1.5">
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  {step.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Venture Business Logic Flow */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Local Convenience Logic
          </h2>
          <p className="text-sm text-slate-600">
            CampusCart focuses strictly on rapid, scheduled local access rather than
            complex marketplace logistics or surge delivery fees.
          </p>
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VENTURE_FLOW.map((stage, index) => (
            <li
              key={stage}
              className="rounded-xl bg-slate-50 border border-slate-200/80 px-4 py-3 text-sm text-slate-800 flex items-center gap-3"
            >
              <span className="font-mono text-xs font-semibold text-teal-700 shrink-0">
                {String(index + 1).padStart(2, '0')}.
              </span>
              <span className="font-medium">{stage}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Coverage & CTA */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Dehradun Campus &amp; Residential Coverage
          </h2>
          <p className="text-sm text-slate-600">
            Scheduled delivery slots cover DGU campus housing and adjacent student
            residential blocks:
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {DELIVERY_LOCATIONS.join(' · ')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('catalog')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>Shop Essentials</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
}
