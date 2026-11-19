import { WHATSAPP_BUSINESS_NUMBER } from '../data/catalog';
import type { CheckoutDraft, PersistedStore } from '../types/campuscart';

const STORAGE_KEY = 'campuscart_mvp_store_v1';

export const EMPTY_CHECKOUT_DRAFT: CheckoutDraft = {
  fullName: '',
  phone: '',
  studentId: '',
  deliveryLocation: '',
  address: '',
  deliverySlot: 'Today — Evening',
};

export function createInitialStore(): PersistedStore {
  return {
    users: [],
    activeProfile: null,
    cart: [],
    checkoutDraft: { ...EMPTY_CHECKOUT_DRAFT },
    orders: [],
    earlyAccess: [],
    availabilityOverrides: {},
    whatsappBusinessNumber: WHATSAPP_BUSINESS_NUMBER,
  };
}

export function loadStore(): PersistedStore {
  if (typeof window === 'undefined') {
    return createInitialStore();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialStore();
    const parsed = JSON.parse(raw) as Partial<PersistedStore>;
    const initial = createInitialStore();
    return {
      users: Array.isArray(parsed.users) ? parsed.users : initial.users,
      activeProfile: parsed.activeProfile ?? initial.activeProfile,
      cart: Array.isArray(parsed.cart) ? parsed.cart : initial.cart,
      checkoutDraft: parsed.checkoutDraft
        ? { ...EMPTY_CHECKOUT_DRAFT, ...parsed.checkoutDraft }
        : initial.checkoutDraft,
      orders: Array.isArray(parsed.orders) ? parsed.orders : initial.orders,
      earlyAccess: Array.isArray(parsed.earlyAccess)
        ? parsed.earlyAccess
        : initial.earlyAccess,
      availabilityOverrides:
        parsed.availabilityOverrides && typeof parsed.availabilityOverrides === 'object'
          ? parsed.availabilityOverrides
          : initial.availabilityOverrides,
      whatsappBusinessNumber:
        typeof parsed.whatsappBusinessNumber === 'string' &&
        parsed.whatsappBusinessNumber.trim()
          ? parsed.whatsappBusinessNumber
          : WHATSAPP_BUSINESS_NUMBER,
    };
  } catch {
    return createInitialStore();
  }
}

export function saveStore(store: PersistedStore): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage quota errors in private browsing
  }
}

export function clearStore(): PersistedStore {
  const initial = createInitialStore();
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
  return initial;
}
