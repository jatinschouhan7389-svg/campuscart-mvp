import type { PageId } from '../types/campuscart';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-slate-200">
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="font-display text-lg font-bold text-slate-900 hover:text-teal-700 transition-colors cursor-pointer"
            >
              CampusCart
            </button>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Your Essentials. Nearby. On Time. Local cleaning and household essentials
              with scheduled delivery and WhatsApp ordering for DGU MBA students in
              Dehradun.
            </p>
            <p className="text-xs text-slate-500">
              Version 1 Web MVP Prototype · Sample catalog pricing in INR
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-sm font-semibold text-slate-900">
              Student Journey
            </h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('onboarding')}
                  className="hover:text-teal-700 transition-colors cursor-pointer"
                >
                  Student Onboarding & Profile
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-teal-700 transition-colors cursor-pointer"
                >
                  Browse Essentials Catalog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-teal-700 transition-colors cursor-pointer"
                >
                  How Scheduled Delivery Works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('orders')}
                  className="hover:text-teal-700 transition-colors cursor-pointer"
                >
                  My Order History
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-sm font-semibold text-slate-900">
              Venture Validation & Operations
            </h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('early-access')}
                  className="hover:text-teal-700 transition-colors cursor-pointer"
                >
                  CampusCart Early Access (30-Student Goal)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="font-medium text-teal-700 hover:text-teal-800 transition-colors cursor-pointer"
                >
                  Venture Metrics & Admin Dashboard
                </button>
              </li>
            </ul>
            <p className="text-xs text-slate-500 pt-2">
              Serving DGU Campus Housing & nearby residential blocks in Dehradun.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CampusCart · Built for DGU students in Dehradun</p>
          <p>Web Prototype · Scheduled Campus-Adjacent Delivery + WhatsApp Confirmation</p>
        </div>
      </div>
    </footer>
  );
}
