import { useState } from 'react';
import { AlertCircle, Check, Minus, Plus, Search, ShoppingBag } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';
import type { Category, Product } from '../types/campuscart';
import { filterProducts, formatINR } from '../utils/commerce';
import { ProductImage } from './ProductImage';

interface CatalogPageProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenCart: () => void;
}

export function CatalogPage({
  products,
  onSelectProduct,
  onAddToCart,
  onOpenCart,
}: CatalogPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const filtered = filterProducts(products, searchQuery, selectedCategory);

  const getQty = (id: string) => quantities[id] ?? 1;

  const adjustQty = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, Math.min(20, (prev[id] ?? 1) + delta)),
    }));
  };

  const handleAdd = (product: Product) => {
    if (!product.available) {
      setFeedback({
        type: 'error',
        message: 'Sorry, this product is currently unavailable.',
      });
      return;
    }
    const qty = getQty(product.id);
    onAddToCart(product, qty);
    setFeedback({
      type: 'success',
      message: `Added ${product.name} (${qty}) to your cart.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-teal-700">
            Sample MVP Product Data · Local Dehradun Availability
          </p>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Household &amp; Cleaning Essentials
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Curated cleaning essentials stocked near DGU campus. Sample prices are shown
            in Indian Rupees for prototype demonstration.
          </p>
        </div>

        <div className="w-full md:w-80">
          <label htmlFor="catalog-search" className="sr-only">
            Search household essentials
          </label>
          <div className="relative">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="catalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cleaners, detergent, sponge..."
              className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter by category"
        className="flex items-center gap-1.5 overflow-x-auto pb-1"
      >
        {(['All', ...CATEGORIES] as const).map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-teal-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {category === 'All' ? 'All Essentials' : category}
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={`rounded-xl px-4 py-3 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm ${
            feedback.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-teal-50 border-teal-200 text-teal-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-700" aria-hidden="true" />
            ) : (
              <Check className="w-4 h-4 shrink-0 text-teal-700" aria-hidden="true" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
          {feedback.type === 'success' && (
            <button
              type="button"
              onClick={onOpenCart}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>View Cart &amp; Checkout</span>
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-800 tabular-nums">{filtered.length}</strong>{' '}
          of <span className="tabular-nums">{products.length}</span> sample products
        </span>
        {(searchQuery || selectedCategory !== 'All') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-teal-700 font-medium hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <p className="font-display text-lg font-semibold text-slate-900">
            No matching essentials found
          </p>
          <p className="text-sm text-slate-600">
            Try clearing your search term or selecting a different category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-2 px-4 py-2 rounded-lg bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-colors cursor-pointer"
          >
            Show All Essentials
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => {
            const qty = getQty(product.id);
            return (
              <article
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => onSelectProduct(product.id)}
                  className="block text-left cursor-pointer"
                  aria-label={`View details for ${product.name}`}
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
                      className="text-left font-display text-lg font-semibold text-slate-900 hover:text-teal-700 transition-colors cursor-pointer"
                    >
                      {product.name}
                    </button>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono tabular-nums text-lg font-bold text-slate-900">
                        {formatINR(product.price)}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          product.available ? 'text-teal-700' : 'text-red-700'
                        }`}
                      >
                        {product.available ? 'In Stock Locally' : 'Currently Unavailable'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-50">
                        <button
                          type="button"
                          onClick={() => adjustQty(product.id, -1)}
                          aria-label={`Decrease quantity for ${product.name}`}
                          className="w-9 h-10 inline-flex items-center justify-center text-slate-700 hover:bg-slate-200/70 rounded-l-lg transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <span
                          aria-label={`Quantity for ${product.name}`}
                          className="w-9 text-center font-mono tabular-nums text-sm font-medium text-slate-900"
                        >
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => adjustQty(product.id, 1)}
                          aria-label={`Increase quantity for ${product.name}`}
                          className="w-9 h-10 inline-flex items-center justify-center text-slate-700 hover:bg-slate-200/70 rounded-r-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAdd(product)}
                        aria-label={`Add ${product.name} to cart`}
                        className={`flex-1 h-10 px-4 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                          product.available
                            ? 'bg-teal-700 text-white hover:bg-teal-800'
                            : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {product.available ? 'Add to Cart' : 'Unavailable'}
                      </button>
                    </div>
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
