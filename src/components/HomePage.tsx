import { ArrowRight, CheckCircle2, Clock, MapPin, MessageCircle, ShieldCheck } from 'lucide-react';
import { EARLY_ACCESS_TARGET, HERO_IMAGE } from '../data/catalog';
import type { PageId, Product, UserProfile } from '../types/campuscart';
import { formatINR } from '../utils/commerce';
import { ProductImage } from './ProductImage';

interface HomePageProps {
  featuredProducts: Product[];
  activeProfile: UserProfile | null;
  earlyAccessCount: number;
  onNavigate: (page: PageId) => void;
  onSelectProduct: (productId: string) => void;
  onQuickAdd: (product: Product) => void;
}

const VALUE_PILLARS = [
  {
    icon: MapPin,
    title: 'Local Availability',
    description:
      'Stocked for DGU campus housing and nearby Dehradun residential blocks so you skip trips to distant markets.',
  },
  {
    icon: Clock,
    title: 'Time Saving',
    description:
      'Order everyday cleaning essentials in under two minutes between lectures without relying on personal transport.',
  },
  {
    icon: CheckCircle2,
    title: 'Scheduled Delivery',
    description:
      'Pick a clear morning or evening campus-adjacent delivery slot that matches your MBA class schedule.',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Ordering',
    description:
      'Generate a pre-filled order message in one click and confirm directly on WhatsApp without retyping.',
  },
];

export function HomePage({
  featuredProducts,
  activeProfile,
  earlyAccessCount,
  onNavigate,
  onSelectProduct,
  onQuickAdd,
}: HomePageProps) {
  return (
    <div className="space-y-20 pb-8">
      {/* Section 1: Storefront Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
              <p className="text-sm font-medium text-teal-700">
                Built for DGU students · Dehradun campus housing &amp; nearby residential blocks
              </p>

              <h1
                className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.12]"
                style={{ textWrap: 'balance' }}
              >
                Your Essentials. Nearby. On Time.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Cleaning and household essentials for DGU students — simple ordering,
                scheduled delivery and less time spent travelling.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('catalog')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Shop Essentials</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  How CampusCart Works
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
                <span>DGU 1st &amp; 2nd Year MBA Students</span>
                <span aria-hidden="true">·</span>
                <span>Fixed ₹0 MVP Delivery</span>
                <span aria-hidden="true">·</span>
                {activeProfile ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('onboarding')}
                    className="text-teal-700 font-medium hover:underline cursor-pointer"
                  >
                    Signed in as {activeProfile.fullName}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('onboarding')}
                    className="text-teal-700 font-medium hover:underline cursor-pointer"
                  >
                    First time here? Complete student onboarding
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <ProductImage
                  src={HERO_IMAGE}
                  alt="Household cleaning essentials neatly packed for DGU student apartment delivery in Dehradun"
                  aspectClass="aspect-[16/9] lg:aspect-auto lg:h-full"
                  className="lg:min-h-[380px]"
                />
              </div>
            </div>
          </div>

          {/* 4-column value strip below the hero split */}
          <div className="mt-14 pt-10 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUE_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="space-y-2">
                  <div className="flex items-center gap-2.5 text-slate-900">
                    <Icon className="w-5 h-5 text-teal-700 shrink-0" aria-hidden="true" />
                    <h2 className="font-display text-base font-semibold">
                      {pillar.title}
                    </h2>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 2: Featured Cleaning & Household Essentials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-500">
              Sample MVP Catalog · Local Student Essentials
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Everyday Cleaning Essentials
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>View all 10 essentials</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <article
              key={product.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => onSelectProduct(product.id)}
                aria-label={`View details for ${product.name}`}
                className="text-left block focus-visible:outline-2 cursor-pointer"
              >
                <ProductImage src={product.image} alt={product.name} />
              </button>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{product.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.packSize}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product.id)}
                    className="text-left font-display text-base font-semibold text-slate-900 hover:text-teal-700 transition-colors cursor-pointer"
                  >
                    {product.name}
                  </button>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono tabular-nums text-base font-semibold text-slate-900">
                      {formatINR(product.price)}
                    </p>
                    <p
                      className={`text-xs ${
                        product.available ? 'text-teal-700' : 'text-amber-700'
                      }`}
                    >
                      {product.available ? 'Available locally' : 'Unavailable'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onQuickAdd(product)}
                    aria-label={`Add ${product.name} to cart`}
                    className="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-teal-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 3: The Student Problem & Venture Validation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-medium text-teal-700">
              Built around a real residential student pain point
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold text-slate-900"
              style={{ textWrap: 'balance' }}
            >
              No personal vehicle. Busy MBA week. Essential cleaners needed today.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              When you run out of surface cleaner or dishwashing liquid before a busy
              week or weekend hosting, travelling to distant Dehradun markets or waiting
              for unpredictable deliveries wastes valuable study time. CampusCart keeps
              essential supplies local with scheduled campus-adjacent drop-offs confirmed
              directly on WhatsApp.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('early-access')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Join Early Access</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="text-sm font-medium text-slate-700 hover:text-teal-700 transition-colors cursor-pointer"
              >
                View Venture Metrics
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 rounded-xl p-6 space-y-4 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                Early Access Sign-ups
              </span>
              <ShieldCheck className="w-5 h-5 text-teal-700" aria-hidden="true" />
            </div>
            <p className="font-mono tabular-nums text-3xl font-bold text-slate-900">
              {earlyAccessCount} / {EARLY_ACCESS_TARGET}
            </p>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-700 transition-all duration-300"
                style={{
                  width: `${Math.min(100, (earlyAccessCount / EARLY_ACCESS_TARGET) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prototype validation goal: confirm whether at least 30 DGU residential
              students will pre-book cleaning essentials via WhatsApp ordering.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
