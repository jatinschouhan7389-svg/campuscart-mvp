import type {
  CartItem,
  Category,
  CheckoutDraft,
  DeliverySlot,
  EarlyAccessEntry,
  Order,
  OrderItem,
  Product,
  UserProfile,
} from '../types/campuscart';

export interface CartSummary {
  lineItems: OrderItem[];
  itemCount: number;
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
}

export interface ValidationErrors {
  [field: string]: string;
}

export interface VentureMetrics {
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  scheduledOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalSales: number;
  averageOrderValue: number;
  mostOrderedProduct: { name: string; units: number } | null;
  ordersBySlot: { slot: DeliverySlot; count: number }[];
  earlyAccessCount: number;
  earlyAccessTarget: number;
}

const ALL_SLOTS: DeliverySlot[] = [
  'Today — Evening',
  'Tomorrow — Morning',
  'Tomorrow — Evening',
  'Next Available Slot',
];

export function formatINR(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `₹${safe.toLocaleString('en-IN')}`;
}

export function isValidIndianPhone(phone: string): boolean {
  const digits = phone.replace(/[\s\-()+]/g, '');
  if (/^\d{10}$/.test(digits)) {
    return /^[6-9]\d{9}$/.test(digits);
  }
  if (/^91\d{10}$/.test(digits)) {
    return /^91[6-9]\d{9}$/.test(digits);
  }
  return false;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function applyAvailabilityOverrides(
  products: Product[],
  overrides: Record<string, boolean>,
): Product[] {
  return products.map((product) =>
    Object.prototype.hasOwnProperty.call(overrides, product.id)
      ? { ...product, available: overrides[product.id] }
      : product,
  );
}

export function filterProducts(
  products: Product[],
  searchQuery: string,
  category: Category | 'All',
): Product[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return products.filter((product) => {
    const matchesCategory = category === 'All' || product.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.shortDescription.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      product.packSize.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function calculateCartTotals(
  cart: CartItem[],
  products: Product[],
  fixedDeliveryCharge = 0,
): CartSummary {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const lineItems: OrderItem[] = [];

  for (const entry of cart) {
    const product = productMap.get(entry.productId);
    if (!product || entry.quantity <= 0) continue;
    const quantity = Math.floor(entry.quantity);
    lineItems.push({
      productId: product.id,
      productName: product.name,
      packSize: product.packSize,
      unitPrice: product.price,
      quantity,
      lineTotal: product.price * quantity,
    });
  }

  const itemCount = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryCharge = itemCount > 0 ? fixedDeliveryCharge : 0;
  const grandTotal = subtotal + deliveryCharge;

  return {
    lineItems,
    itemCount,
    subtotal,
    deliveryCharge,
    grandTotal,
  };
}

export function generateOrderId(existingOrderCount: number, now = new Date()): string {
  const year = now.getFullYear();
  const sequence = String(existingOrderCount + 1).padStart(4, '0');
  return `CC-${year}-${sequence}`;
}

export function buildWhatsAppOrderMessage(order: Order): string {
  const productLines = order.items
    .map((item) => `${item.productName} x ${item.quantity}`)
    .join('\n');

  const locationDisplay = order.address.trim()
    ? `${order.deliveryLocation} — ${order.address.trim()}`
    : order.deliveryLocation;

  return [
    'Hello CampusCart,',
    'I would like to place the following order:',
    '',
    `Order ID: ${order.id}`,
    '',
    `Customer Name: ${order.customerName}`,
    `Student ID: ${order.studentId}`,
    `Phone: ${order.phone}`,
    '',
    'Products:',
    productLines,
    '',
    `Total Amount: ₹${order.totalAmount}`,
    '',
    'Delivery Location:',
    locationDisplay,
    '',
    'Preferred Delivery Slot:',
    order.deliverySlot,
    '',
    'Please confirm my order.',
  ].join('\n');
}

export function buildWhatsAppUrl(
  message: string,
  businessNumber = 'WHATSAPP_BUSINESS_NUMBER',
): string {
  const cleanNumber = businessNumber.trim() || 'WHATSAPP_BUSINESS_NUMBER';
  const target =
    cleanNumber === 'WHATSAPP_BUSINESS_NUMBER'
      ? cleanNumber
      : cleanNumber.replace(/[^\d]/g, '') || 'WHATSAPP_BUSINESS_NUMBER';
  return `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
}

export interface OnboardingInput {
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
  accommodation: string;
  preferredLocation: string;
}

export function validateOnboardingForm(input: OnboardingInput): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!input.fullName.trim()) {
    errors.fullName = 'Please enter your name.';
  }
  if (!input.studentId.trim()) {
    errors.studentId = 'Please enter your DGU Student ID / Roll Number.';
  }
  if (!input.email.trim() || !isValidEmail(input.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!input.phone.trim() || !isValidIndianPhone(input.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (!input.accommodation.trim()) {
    errors.accommodation = 'Please enter your hostel, block, or residential area.';
  }
  if (!input.preferredLocation.trim()) {
    errors.preferredLocation = 'Please select your delivery location.';
  }
  return errors;
}

export function validateCheckoutForm(
  input: CheckoutDraft,
  cartItemCount: number,
): ValidationErrors {
  const errors: ValidationErrors = {};
  if (cartItemCount <= 0) {
    errors.cart = 'Your cart is empty. Add an item before checkout.';
  }
  if (!input.fullName.trim()) {
    errors.fullName = 'Please enter your name.';
  }
  if (!input.phone.trim() || !isValidIndianPhone(input.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (!input.studentId.trim()) {
    errors.studentId = 'Please enter your DGU Student ID / Roll Number.';
  }
  if (!input.deliveryLocation.trim()) {
    errors.deliveryLocation = 'Please select your delivery location.';
  }
  if (!input.address.trim()) {
    errors.address = 'Please enter your room number, flat, or residential block.';
  }
  if (!input.deliverySlot) {
    errors.deliverySlot = 'Please select a scheduled delivery slot.';
  }
  return errors;
}

export interface EarlyAccessInput {
  name: string;
  studentId: string;
  phone: string;
  residentialLocation: string;
  preferredProduct: string;
  preferredDeliveryTime: DeliverySlot | '';
}

export function validateEarlyAccessForm(input: EarlyAccessInput): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!input.name.trim()) {
    errors.name = 'Please enter your name.';
  }
  if (!input.studentId.trim()) {
    errors.studentId = 'Please enter your DGU Student ID / Roll Number.';
  }
  if (!input.phone.trim() || !isValidIndianPhone(input.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (!input.residentialLocation.trim()) {
    errors.residentialLocation = 'Please select your delivery location.';
  }
  if (!input.preferredProduct.trim()) {
    errors.preferredProduct = 'Please select your preferred essential product.';
  }
  if (!input.preferredDeliveryTime) {
    errors.preferredDeliveryTime = 'Please select a preferred delivery time.';
  }
  return errors;
}

export function computeVentureMetrics(
  users: UserProfile[],
  orders: Order[],
  earlyAccessEntries: EarlyAccessEntry[],
  earlyAccessTarget = 30,
): VentureMetrics {
  const totalOrders = orders.length;
  const activeOrders = orders.filter((o) => o.status !== 'Cancelled');
  const pendingOrders = orders.filter((o) => o.status === 'Order Placed').length;
  const confirmedOrders = orders.filter((o) => o.status === 'Confirmed').length;
  const scheduledOrders = orders.filter((o) => o.status === 'Scheduled').length;
  const completedOrders = orders.filter((o) => o.status === 'Delivered').length;
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled').length;

  const totalSales = activeOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue =
    activeOrders.length > 0 ? Math.round(totalSales / activeOrders.length) : 0;

  const productUnits = new Map<string, number>();
  for (const order of activeOrders) {
    for (const item of order.items) {
      productUnits.set(
        item.productName,
        (productUnits.get(item.productName) ?? 0) + item.quantity,
      );
    }
  }

  let mostOrderedProduct: { name: string; units: number } | null = null;
  for (const [name, units] of productUnits.entries()) {
    if (!mostOrderedProduct || units > mostOrderedProduct.units) {
      mostOrderedProduct = { name, units };
    }
  }

  const slotCounts = new Map<DeliverySlot, number>();
  for (const slot of ALL_SLOTS) {
    slotCounts.set(slot, 0);
  }
  for (const order of orders) {
    slotCounts.set(order.deliverySlot, (slotCounts.get(order.deliverySlot) ?? 0) + 1);
  }

  const ordersBySlot = ALL_SLOTS.map((slot) => ({
    slot,
    count: slotCounts.get(slot) ?? 0,
  }));

  return {
    totalUsers: users.length,
    totalOrders,
    pendingOrders,
    confirmedOrders,
    scheduledOrders,
    completedOrders,
    cancelledOrders,
    totalSales,
    averageOrderValue,
    mostOrderedProduct,
    ordersBySlot,
    earlyAccessCount: earlyAccessEntries.length,
    earlyAccessTarget,
  };
}
