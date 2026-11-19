import test from 'node:test';
import assert from 'node:assert/strict';
import { SAMPLE_PRODUCTS } from '../data/catalog';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  calculateCartTotals,
  computeVentureMetrics,
  filterProducts,
  generateOrderId,
  validateCheckoutForm,
  validateEarlyAccessForm,
  validateOnboardingForm,
} from './commerce';
import type { EarlyAccessEntry, Order, UserProfile } from '../types/campuscart';

test('calculateCartTotals computes subtotal, fixed ₹0 delivery charge, and grand total', () => {
  const summary = calculateCartTotals(
    [
      { productId: 'prod-surface-cleaner', quantity: 2 }, // 2 * 99 = 198
      { productId: 'prod-dishwashing-liquid', quantity: 1 }, // 1 * 89 = 89
    ],
    SAMPLE_PRODUCTS,
    0,
  );
  assert.equal(summary.itemCount, 3);
  assert.equal(summary.subtotal, 287);
  assert.equal(summary.deliveryCharge, 0);
  assert.equal(summary.grandTotal, 287);
  assert.equal(summary.lineItems.length, 2);
});

test('filterProducts filters by category and search query', () => {
  const surfaceItems = filterProducts(SAMPLE_PRODUCTS, '', 'Surface Cleaning');
  assert.equal(surfaceItems.length, 3);

  const queryItems = filterProducts(SAMPLE_PRODUCTS, 'sponge', 'All');
  assert.equal(queryItems.length, 1);
  assert.equal(queryItems[0].id, 'prod-cleaning-sponge');
});

test('buildWhatsAppOrderMessage and buildWhatsAppUrl match required template and encode correctly', () => {
  const order: Order = {
    id: 'CC-2026-0001',
    customerId: 'user-1',
    customerName: 'Aarav Sharma',
    studentId: 'DGU-MBA-2601',
    phone: '9876543210',
    deliveryLocation: 'DGU Campus Housing — Boys Hostel',
    address: 'Room 204, Block B',
    deliverySlot: 'Today — Evening',
    items: [
      {
        productId: 'prod-surface-cleaner',
        productName: 'Surface Cleaner',
        packSize: '500 ml',
        unitPrice: 99,
        quantity: 2,
        lineTotal: 198,
      },
      {
        productId: 'prod-floor-cleaner',
        productName: 'Floor Cleaner',
        packSize: '1 L',
        unitPrice: 149,
        quantity: 1,
        lineTotal: 149,
      },
    ],
    subtotal: 347,
    deliveryCharge: 0,
    totalAmount: 347,
    status: 'Order Placed',
    createdAt: '2026-11-19T10:00:00.000Z',
  };

  const message = buildWhatsAppOrderMessage(order);
  assert.match(message, /Hello CampusCart,/);
  assert.match(message, /Order ID: CC-2026-0001/);
  assert.match(message, /Customer Name: Aarav Sharma/);
  assert.match(message, /Student ID: DGU-MBA-2601/);
  assert.match(message, /Surface Cleaner x 2/);
  assert.match(message, /Floor Cleaner x 1/);
  assert.match(message, /Total Amount: ₹347/);
  assert.match(message, /Today — Evening/);
  assert.match(message, /Please confirm my order\./);

  const url = buildWhatsAppUrl(message, 'WHATSAPP_BUSINESS_NUMBER');
  assert.ok(url.startsWith('https://wa.me/WHATSAPP_BUSINESS_NUMBER?text='));
  assert.ok(decodeURIComponent(url.split('?text=')[1]).includes('Order ID: CC-2026-0001'));
});

test('validateCheckoutForm blocks empty cart and missing/invalid fields with exact messages', () => {
  const errors = validateCheckoutForm(
    {
      fullName: '',
      phone: '12345',
      studentId: '',
      deliveryLocation: '',
      address: '',
      deliverySlot: '',
    },
    0,
  );
  assert.equal(errors.cart, 'Your cart is empty. Add an item before checkout.');
  assert.equal(errors.fullName, 'Please enter your name.');
  assert.equal(errors.phone, 'Please enter a valid phone number.');
  assert.equal(errors.deliveryLocation, 'Please select your delivery location.');
});

test('validateOnboardingForm and validateEarlyAccessForm validate required fields', () => {
  const onboardingErrors = validateOnboardingForm({
    fullName: '',
    studentId: '',
    email: 'invalid-email',
    phone: '555',
    accommodation: '',
    preferredLocation: '',
  });
  assert.equal(onboardingErrors.fullName, 'Please enter your name.');
  assert.equal(onboardingErrors.phone, 'Please enter a valid phone number.');
  assert.equal(onboardingErrors.preferredLocation, 'Please select your delivery location.');

  const validOnboarding = validateOnboardingForm({
    fullName: 'Meera Rawat',
    studentId: 'DGU-MBA-2614',
    email: 'meera.rawat@dgu.edu.in',
    phone: '9811223344',
    accommodation: 'Girls Hostel Block C, Room 112',
    preferredLocation: 'DGU Campus Housing — Girls Hostel',
  });
  assert.equal(Object.keys(validOnboarding).length, 0);

  const earlyErrors = validateEarlyAccessForm({
    name: '',
    studentId: '',
    phone: '000',
    residentialLocation: '',
    preferredProduct: '',
    preferredDeliveryTime: '',
  });
  assert.equal(earlyErrors.name, 'Please enter your name.');
  assert.equal(earlyErrors.phone, 'Please enter a valid phone number.');
});

test('computeVentureMetrics aggregates prototype metrics accurately from zero and non-zero data', () => {
  const emptyMetrics = computeVentureMetrics([], [], [], 30);
  assert.equal(emptyMetrics.totalUsers, 0);
  assert.equal(emptyMetrics.totalOrders, 0);
  assert.equal(emptyMetrics.totalSales, 0);
  assert.equal(emptyMetrics.averageOrderValue, 0);
  assert.equal(emptyMetrics.earlyAccessCount, 0);
  assert.equal(emptyMetrics.earlyAccessTarget, 30);
  assert.equal(emptyMetrics.mostOrderedProduct, null);

  const users: UserProfile[] = [
    {
      id: 'u1',
      fullName: 'Aarav Sharma',
      studentId: 'DGU-MBA-2601',
      email: 'aarav@dgu.edu.in',
      phone: '9876543210',
      accommodation: 'Boys Hostel',
      preferredLocation: 'DGU Campus Housing — Boys Hostel',
      createdAt: '2026-11-19T10:00:00.000Z',
    },
  ];
  const orders: Order[] = [
    {
      id: generateOrderId(0, new Date('2026-11-19T10:00:00.000Z')),
      customerId: 'u1',
      customerName: 'Aarav Sharma',
      studentId: 'DGU-MBA-2601',
      phone: '9876543210',
      deliveryLocation: 'DGU Campus Housing — Boys Hostel',
      address: 'Room 204',
      deliverySlot: 'Today — Evening',
      items: [
        {
          productId: 'prod-surface-cleaner',
          productName: 'Surface Cleaner',
          packSize: '500 ml',
          unitPrice: 99,
          quantity: 3,
          lineTotal: 297,
        },
      ],
      subtotal: 297,
      deliveryCharge: 0,
      totalAmount: 297,
      status: 'Order Placed',
      createdAt: '2026-11-19T10:00:00.000Z',
    },
  ];
  const earlyAccess: EarlyAccessEntry[] = [
    {
      id: 'ea-1',
      name: 'Aarav Sharma',
      studentId: 'DGU-MBA-2601',
      phone: '9876543210',
      residentialLocation: 'DGU Campus Housing — Boys Hostel',
      preferredProduct: 'Surface Cleaner',
      preferredDeliveryTime: 'Today — Evening',
      createdAt: '2026-11-19T10:05:00.000Z',
    },
  ];

  const metrics = computeVentureMetrics(users, orders, earlyAccess, 30);
  assert.equal(metrics.totalUsers, 1);
  assert.equal(metrics.totalOrders, 1);
  assert.equal(metrics.pendingOrders, 1);
  assert.equal(metrics.totalSales, 297);
  assert.equal(metrics.averageOrderValue, 297);
  assert.deepEqual(metrics.mostOrderedProduct, { name: 'Surface Cleaner', units: 3 });
  assert.equal(metrics.earlyAccessCount, 1);
  assert.equal(
    metrics.ordersBySlot.find((s) => s.slot === 'Today — Evening')?.count,
    1,
  );
});
