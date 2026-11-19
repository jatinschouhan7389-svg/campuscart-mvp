import { useEffect, useMemo, useState } from 'react';
import {
  EARLY_ACCESS_TARGET,
  FIXED_DELIVERY_CHARGE,
  SAMPLE_PRODUCTS,
} from './data/catalog';
import type {
  CheckoutDraft,
  Order,
  OrderStatus,
  PageId,
  PersistedStore,
  Product,
  UserProfile,
} from './types/campuscart';
import {
  applyAvailabilityOverrides,
  calculateCartTotals,
  computeVentureMetrics,
  generateOrderId,
  type EarlyAccessInput,
  type OnboardingInput,
} from './utils/commerce';
import {
  clearStore,
  EMPTY_CHECKOUT_DRAFT,
  loadStore,
  saveStore,
} from './utils/storage';
import { AdminMetricsPage } from './components/AdminMetricsPage';
import { CartPage } from './components/CartPage';
import { CatalogPage } from './components/CatalogPage';
import { CheckoutPage } from './components/CheckoutPage';
import { EarlyAccessPage } from './components/EarlyAccessPage';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { MyOrdersPage } from './components/MyOrdersPage';
import { OnboardingPage } from './components/OnboardingPage';
import { OrderReviewPage } from './components/OrderReviewPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { WhatsAppOrderPage } from './components/WhatsAppOrderPage';

const VALID_PAGES: PageId[] = [
  'home',
  'onboarding',
  'catalog',
  'product',
  'cart',
  'checkout',
  'review',
  'whatsapp',
  'success',
  'orders',
  'how-it-works',
  'early-access',
  'admin',
];

function getInitialPage(): PageId {
  if (typeof window === 'undefined') return 'home';
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('page') as PageId | null;
  if (requested && VALID_PAGES.includes(requested)) {
    return requested;
  }
  return 'home';
}

export default function App() {
  const [store, setStore] = useState<PersistedStore>(() => loadStore());
  const [currentPage, setCurrentPage] = useState<PageId>(() => getInitialPage());
  const [selectedProductId, setSelectedProductId] = useState<string>(
    SAMPLE_PRODUCTS[0].id,
  );
  const [activeOrderId, setActiveOrderId] = useState<string | null>(
    () => loadStore().orders[0]?.id ?? null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    saveStore(store);
  }, [store]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setToastMessage(null);
  }, [currentPage]);

  const products = useMemo(
    () => applyAvailabilityOverrides(SAMPLE_PRODUCTS, store.availabilityOverrides),
    [store.availabilityOverrides],
  );

  const cartSummary = useMemo(
    () => calculateCartTotals(store.cart, products, FIXED_DELIVERY_CHARGE),
    [store.cart, products],
  );

  const metrics = useMemo(
    () =>
      computeVentureMetrics(
        store.users,
        store.orders,
        store.earlyAccess,
        EARLY_ACCESS_TARGET,
      ),
    [store.users, store.orders, store.earlyAccess],
  );

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId],
  );

  const activeOrder = useMemo(
    () => store.orders.find((o) => o.id === activeOrderId) ?? store.orders[0] ?? null,
    [store.orders, activeOrderId],
  );

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3000);
  };

  const handleNavigate = (page: PageId) => {
    if (page === 'checkout') {
      setStore((prev) => ({
        ...prev,
        checkoutDraft: {
          fullName: prev.checkoutDraft.fullName || prev.activeProfile?.fullName || '',
          phone: prev.checkoutDraft.phone || prev.activeProfile?.phone || '',
          studentId: prev.checkoutDraft.studentId || prev.activeProfile?.studentId || '',
          deliveryLocation:
            prev.checkoutDraft.deliveryLocation ||
            prev.activeProfile?.preferredLocation ||
            '',
          address:
            prev.checkoutDraft.address || prev.activeProfile?.accommodation || '',
          deliverySlot: prev.checkoutDraft.deliverySlot || 'Today — Evening',
        },
      }));
    }
    setCurrentPage(page);
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product');
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    if (!product.available) {
      showToast('Sorry, this product is currently unavailable.');
      return;
    }
    setStore((prev) => {
      const existing = prev.cart.find((c) => c.productId === product.id);
      const nextCart = existing
        ? prev.cart.map((c) =>
            c.productId === product.id
              ? { ...c, quantity: Math.min(20, c.quantity + quantity) }
              : c,
          )
        : [...prev.cart, { productId: product.id, quantity }];
      return { ...prev, cart: nextCart };
    });
    showToast(`Added ${product.name} to cart`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    setStore((prev) => {
      if (quantity <= 0) {
        return {
          ...prev,
          cart: prev.cart.filter((item) => item.productId !== productId),
        };
      }
      return {
        ...prev,
        cart: prev.cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(20, quantity) }
            : item,
        ),
      };
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setStore((prev) => ({
      ...prev,
      cart: prev.cart.filter((item) => item.productId !== productId),
    }));
  };

  const handleSaveProfile = (input: OnboardingInput) => {
    setStore((prev) => {
      const normalizedStudentId = input.studentId.trim().toLowerCase();
      const existing = prev.users.find(
        (u) => u.studentId.trim().toLowerCase() === normalizedStudentId,
      );
      const profile: UserProfile = {
        id: existing?.id ?? `user-${Date.now()}`,
        fullName: input.fullName.trim(),
        studentId: input.studentId.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        accommodation: input.accommodation.trim(),
        preferredLocation: input.preferredLocation,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      };
      const nextUsers = existing
        ? prev.users.map((u) => (u.id === existing.id ? profile : u))
        : [profile, ...prev.users];

      return {
        ...prev,
        users: nextUsers,
        activeProfile: profile,
        checkoutDraft: {
          ...prev.checkoutDraft,
          fullName: profile.fullName,
          phone: profile.phone,
          studentId: profile.studentId,
          deliveryLocation: profile.preferredLocation,
          address: profile.accommodation,
        },
      };
    });
    showToast('Student profile saved');
  };

  const handleUpdateCheckoutDraft = (draft: CheckoutDraft) => {
    setStore((prev) => ({ ...prev, checkoutDraft: draft }));
  };

  const handleReviewOrder = (draft: CheckoutDraft) => {
    setStore((prev) => ({ ...prev, checkoutDraft: draft }));
    setCurrentPage('review');
  };

  const handleConfirmOrder = () => {
    if (cartSummary.lineItems.length === 0 || !store.checkoutDraft.deliverySlot) {
      setCurrentPage('checkout');
      return;
    }

    const now = new Date();
    const orderId = generateOrderId(store.orders.length, now);
    const customerId =
      store.activeProfile?.id ??
      `guest-${store.checkoutDraft.studentId.trim() || Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      customerId,
      customerName: store.checkoutDraft.fullName.trim(),
      studentId: store.checkoutDraft.studentId.trim(),
      phone: store.checkoutDraft.phone.trim(),
      deliveryLocation: store.checkoutDraft.deliveryLocation,
      address: store.checkoutDraft.address.trim(),
      deliverySlot: store.checkoutDraft.deliverySlot,
      items: cartSummary.lineItems,
      subtotal: cartSummary.subtotal,
      deliveryCharge: cartSummary.deliveryCharge,
      totalAmount: cartSummary.grandTotal,
      status: 'Order Placed',
      createdAt: now.toISOString(),
    };

    setStore((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      cart: [],
      checkoutDraft: {
        ...EMPTY_CHECKOUT_DRAFT,
        fullName: prev.activeProfile?.fullName ?? prev.checkoutDraft.fullName,
        phone: prev.activeProfile?.phone ?? prev.checkoutDraft.phone,
        studentId: prev.activeProfile?.studentId ?? prev.checkoutDraft.studentId,
        deliveryLocation:
          prev.activeProfile?.preferredLocation ??
          prev.checkoutDraft.deliveryLocation,
        address: prev.activeProfile?.accommodation ?? prev.checkoutDraft.address,
      },
    }));

    setActiveOrderId(orderId);
    setCurrentPage('whatsapp');
  };

  const handleSubmitEarlyAccess = (input: EarlyAccessInput) => {
    if (!input.preferredDeliveryTime) return;
    const entry = {
      id: `ea-${Date.now()}`,
      name: input.name.trim(),
      studentId: input.studentId.trim(),
      phone: input.phone.trim(),
      residentialLocation: input.residentialLocation,
      preferredProduct: input.preferredProduct,
      preferredDeliveryTime: input.preferredDeliveryTime,
      createdAt: new Date().toISOString(),
    };
    setStore((prev) => ({
      ...prev,
      earlyAccess: [entry, ...prev.earlyAccess],
    }));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setStore((prev) => ({
      ...prev,
      orders: prev.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    }));
  };

  const handleToggleProductAvailability = (productId: string, available: boolean) => {
    setStore((prev) => ({
      ...prev,
      availabilityOverrides: {
        ...prev.availabilityOverrides,
        [productId]: available,
      },
    }));
  };

  const handleSaveWhatsAppNumber = (whatsappBusinessNumber: string) => {
    setStore((prev) => ({ ...prev, whatsappBusinessNumber }));
  };

  const handleResetPrototypeData = () => {
    const fresh = clearStore();
    setStore(fresh);
    setActiveOrderId(null);
    showToast('Prototype data reset to zero');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <Header
        currentPage={currentPage}
        cartCount={cartSummary.itemCount}
        activeProfile={store.activeProfile}
        onNavigate={handleNavigate}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 rounded-xl bg-slate-900 text-white px-4 py-3 text-sm font-medium shadow-lg"
        >
          {toastMessage}
        </div>
      )}

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            featuredProducts={products.slice(0, 4)}
            activeProfile={store.activeProfile}
            earlyAccessCount={store.earlyAccess.length}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={(product) => handleAddToCart(product, 1)}
          />
        )}

        {currentPage === 'onboarding' && (
          <OnboardingPage
            activeProfile={store.activeProfile}
            onSaveProfile={handleSaveProfile}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'catalog' && (
          <CatalogPage
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onOpenCart={() => handleNavigate('cart')}
          />
        )}

        {currentPage === 'product' && (
          <ProductDetailPage
            product={selectedProduct}
            onBackToCatalog={() => handleNavigate('catalog')}
            onAddToCart={handleAddToCart}
            onOpenCart={() => handleNavigate('cart')}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            summary={cartSummary}
            products={products}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onProceedToCheckout={() => handleNavigate('checkout')}
            onContinueShopping={() => handleNavigate('catalog')}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            draft={store.checkoutDraft}
            summary={cartSummary}
            onChangeDraft={handleUpdateCheckoutDraft}
            onBackToCart={() => handleNavigate('cart')}
            onReviewOrder={handleReviewOrder}
            onShopNow={() => handleNavigate('catalog')}
          />
        )}

        {currentPage === 'review' && (
          <OrderReviewPage
            draft={store.checkoutDraft}
            summary={cartSummary}
            onEditOrder={() => handleNavigate('checkout')}
            onConfirmOrder={handleConfirmOrder}
          />
        )}

        {currentPage === 'whatsapp' && (
          <WhatsAppOrderPage
            order={activeOrder}
            whatsappBusinessNumber={store.whatsappBusinessNumber}
            onContinueToSuccess={() => handleNavigate('success')}
            onViewOrders={() => handleNavigate('orders')}
          />
        )}

        {currentPage === 'success' && (
          <OrderSuccessPage
            order={activeOrder}
            whatsappBusinessNumber={store.whatsappBusinessNumber}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'orders' && (
          <MyOrdersPage
            orders={store.orders}
            whatsappBusinessNumber={store.whatsappBusinessNumber}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'how-it-works' && (
          <HowItWorksPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'early-access' && (
          <EarlyAccessPage
            products={products}
            earlyAccessCount={store.earlyAccess.length}
            activeProfile={store.activeProfile}
            onSubmitEarlyAccess={handleSubmitEarlyAccess}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'admin' && (
          <AdminMetricsPage
            metrics={metrics}
            orders={store.orders}
            products={products}
            whatsappBusinessNumber={store.whatsappBusinessNumber}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onToggleProductAvailability={handleToggleProductAvailability}
            onSaveWhatsAppNumber={handleSaveWhatsAppNumber}
            onResetPrototypeData={handleResetPrototypeData}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
