import type { Category, DeliverySlot, OrderStatus, Product } from '../types/campuscart';

export const WHATSAPP_BUSINESS_NUMBER = 'WHATSAPP_BUSINESS_NUMBER';

export const FIXED_DELIVERY_CHARGE = 0;

export const EARLY_ACCESS_TARGET = 30;

export const HERO_IMAGE = '/src/assets/images/hero_campus_essentials_1795101389496.jpg';

const IMG_SURFACE = '/src/assets/images/prod_surface_spray_1795101389103.jpg';
const IMG_FLOOR = '/src/assets/images/prod_floor_toilet_1795101387634.jpg';
const IMG_KITCHEN = '/src/assets/images/prod_kitchen_dish_1795101386051.jpg';
const IMG_LAUNDRY = '/src/assets/images/prod_laundry_home_1795101382463.jpg';

export const CATEGORIES: Category[] = [
  'Surface Cleaning',
  'Floor Cleaning',
  'Bathroom Cleaning',
  'Kitchen Cleaning',
  'Laundry',
  'Other Essentials',
];

export const DELIVERY_LOCATIONS: string[] = [
  'DGU Campus Housing — Boys Hostel',
  'DGU Campus Housing — Girls Hostel',
  'DGU MBA Residential Annex',
  'Prem Nagar Residential Block (Dehradun)',
  'Sudhowala Student Apartments (Dehradun)',
  'Nanda Ki Chowki PG & Flats (Dehradun)',
  'Pondha Road Student Housing (Dehradun)',
];

export const DELIVERY_SLOTS: {
  slot: DeliverySlot;
  window: string;
  detail: string;
}[] = [
  {
    slot: 'Today — Evening',
    window: '5:30 PM – 8:00 PM',
    detail: 'Same-day drop-off after classes',
  },
  {
    slot: 'Tomorrow — Morning',
    window: '8:00 AM – 10:30 AM',
    detail: 'Early drop before morning lectures',
  },
  {
    slot: 'Tomorrow — Evening',
    window: '5:30 PM – 8:00 PM',
    detail: 'Standard post-class hostel drop',
  },
  {
    slot: 'Next Available Slot',
    window: 'Earliest Local Batch',
    detail: 'Assigned to the next campus-adjacent run',
  },
];

export const ORDER_STATUSES: OrderStatus[] = [
  'Order Placed',
  'Confirmed',
  'Scheduled',
  'Delivered',
  'Cancelled',
];

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod-surface-cleaner',
    name: 'Surface Cleaner',
    category: 'Surface Cleaning',
    shortDescription: 'Fast-drying everyday cleaner for study desks, counters, and hostel tables.',
    description:
      'Formulated for daily student living spaces, this 500 ml surface cleaner cuts through dust, coffee rings, and light kitchen grease without leaving sticky residue or harsh fumes.',
    packSize: '500 ml',
    price: 99,
    available: true,
    image: IMG_SURFACE,
    createdAt: '2026-01-10T09:00:00.000Z',
  },
  {
    id: 'prod-floor-cleaner',
    name: 'Floor Cleaner',
    category: 'Floor Cleaning',
    shortDescription: 'Fresh-scent liquid concentrate for tiled hostel rooms and shared flats.',
    description:
      'A 1 L everyday floor cleaning solution designed for ceramic, marble, and vitrified tiles in student flats and dorm rooms. Dilutes easily in a single bucket for quick weekend mopping.',
    packSize: '1 L',
    price: 149,
    available: true,
    image: IMG_FLOOR,
    createdAt: '2026-01-10T09:05:00.000Z',
  },
  {
    id: 'prod-dishwashing-liquid',
    name: 'Dishwashing Liquid',
    category: 'Kitchen Cleaning',
    shortDescription: 'Citrus grease-cutting gel for mugs, tiffins, plates, and cookware.',
    description:
      'Gentle-on-hands citrus dishwashing liquid ideal for quick washes of lunch boxes, coffee mugs, and daily kitchenette utensils without white chalky residue.',
    packSize: '500 ml',
    price: 89,
    available: true,
    image: IMG_KITCHEN,
    createdAt: '2026-01-10T09:10:00.000Z',
  },
  {
    id: 'prod-laundry-detergent',
    name: 'Laundry Detergent',
    category: 'Laundry',
    shortDescription: 'Low-foam liquid detergent for bucket wash and shared washing machines.',
    description:
      'Balanced 1 L liquid detergent with measuring cap that works effectively in both cold-water bucket washes and hostel top-load machines, leaving everyday wear crisp.',
    packSize: '1 L',
    price: 185,
    available: true,
    image: IMG_LAUNDRY,
    createdAt: '2026-01-10T09:15:00.000Z',
  },
  {
    id: 'prod-glass-cleaner',
    name: 'Glass Cleaner',
    category: 'Surface Cleaning',
    shortDescription: 'Streak-free spray for room mirrors, windows, and glass tabletops.',
    description:
      'Quick-evaporating 500 ml trigger spray that removes fingerprints, water spots, and Dehradun dust from mirrors, study glass, and balcony doors.',
    packSize: '500 ml',
    price: 105,
    available: true,
    image: IMG_SURFACE,
    createdAt: '2026-01-10T09:20:00.000Z',
  },
  {
    id: 'prod-toilet-cleaner',
    name: 'Toilet Cleaner',
    category: 'Bathroom Cleaning',
    shortDescription: 'Thick angled-neck formula for stain removal and bathroom hygiene.',
    description:
      'Thick clinging gel in an easy-reach angled nozzle bottle that targets hard-water deposits and keeps shared or attached student washrooms fresh and clean.',
    packSize: '500 ml',
    price: 95,
    available: true,
    image: IMG_FLOOR,
    createdAt: '2026-01-10T09:25:00.000Z',
  },
  {
    id: 'prod-cleaning-sponge',
    name: 'Cleaning Sponge',
    category: 'Kitchen Cleaning',
    shortDescription: 'Dual-sided non-scratch cellulose scrub pads for dishes and sinks.',
    description:
      'Pack of 3 durable absorbent sponges with a gentle scouring layer suited for non-stick pans, stainless steel tiffins, and quick kitchenette wipe-downs.',
    packSize: 'Pack of 3',
    price: 65,
    available: true,
    image: IMG_KITCHEN,
    createdAt: '2026-01-10T09:30:00.000Z',
  },
  {
    id: 'prod-garbage-bags',
    name: 'Garbage Bags',
    category: 'Other Essentials',
    shortDescription: 'Leak-resistant medium bin liners for dorm rooms and apartment kitchens.',
    description:
      'Perforated roll of 30 medium-sized (19 × 21 inch) tear-resistant waste bags sized specifically for hostel room dustbins and shared flat kitchens.',
    packSize: '30 pcs Roll',
    price: 79,
    available: true,
    image: IMG_LAUNDRY,
    createdAt: '2026-01-10T09:35:00.000Z',
  },
  {
    id: 'prod-multipurpose-spray',
    name: 'Multipurpose Cleaning Spray',
    category: 'Surface Cleaning',
    shortDescription: 'All-in-one wipe spray for kitchen slabs, shelves, and weekend prep.',
    description:
      'Ready-to-use 500 ml multipurpose spray that handles kitchen counters, wardrobe shelves, and dining surfaces in one wipe—built for fast tidy-ups before a busy week.',
    packSize: '500 ml',
    price: 119,
    available: true,
    image: IMG_SURFACE,
    createdAt: '2026-01-10T09:40:00.000Z',
  },
  {
    id: 'prod-disinfectant',
    name: 'Disinfectant',
    category: 'Bathroom Cleaning',
    shortDescription: 'Multi-purpose antiseptic disinfectant liquid for washrooms and laundry.',
    description:
      'Concentrated 500 ml household disinfectant suitable for bathroom floors, sinks, and occasional laundry sanitising. Currently awaiting local restock batch.',
    packSize: '500 ml',
    price: 135,
    available: false,
    image: IMG_FLOOR,
    createdAt: '2026-01-10T09:45:00.000Z',
  },
];
