import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import type { PageId, UserProfile } from '../types/campuscart';

interface HeaderProps {
  currentPage: PageId;
  cartCount: number;
  activeProfile: UserProfile | null;
  onNavigate: (page: PageId) => void;
}

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'catalog', label: 'Shop' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'orders', label: 'My Orders' },
  { id: 'early-access', label: 'Early Access' },
  { id: 'onboarding', label: 'Profile' },
];

export function Header({
  currentPage,
  cartCount,
  activeProfile,
  onNavigate,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: PageId) => {
    setMobileOpen(false);
    onNavigate(page);
  };

  const isActive = (id: PageId) => {
    if (id === 'catalog' && currentPage === 'product') return true;
    return currentPage === id;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <button
          type="button"
          onClick={() => handleNav('home')}
          className="font-display text-xl font-bold tracking-tight text-slate-900 hover:text-teal-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          CampusCart
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.id);
            const label =
              item.id === 'onboarding' && activeProfile
                ? 'Profile'
                : item.label;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'text-teal-800 font-semibold after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-teal-700'
                    : 'hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary Cart action + mobile menu trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('cart')}
            aria-label={`Open shopping cart with ${cartCount} items`}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'cart'
                ? 'bg-teal-800 text-white'
                : 'bg-teal-700 text-white hover:bg-teal-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Cart</span>
            <span
              data-testid="header-cart-count"
              className="tabular-nums font-mono text-xs bg-white/20 px-1.5 py-0.5 rounded"
            >
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handleNav('admin')}
            aria-current={currentPage === 'admin' ? 'page' : undefined}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              currentPage === 'admin'
                ? 'bg-teal-50 text-teal-800 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Venture Metrics & Admin
          </button>
        </nav>
      )}
    </header>
  );
}
