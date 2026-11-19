export type Category =
  | 'Surface Cleaning'
  | 'Floor Cleaning'
  | 'Bathroom Cleaning'
  | 'Kitchen Cleaning'
  | 'Laundry'
  | 'Other Essentials';

export type DeliverySlot =
  | 'Today — Evening'
  | 'Tomorrow — Morning'
  | 'Tomorrow — Evening'
  | 'Next Available Slot';

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Scheduled'
  | 'Delivered'
  | 'Cancelled';

export type PageId =
  | 'home'
  | 'onboarding'
  | 'catalog'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'review'
  | 'whatsapp'
  | 'success'
  | 'orders'
  | 'how-it-works'
  | 'early-access'
  | 'admin';

export interface Product {
  id: string;
  name: string;
  category: Category;
  shortDescription: string;
  description: string;
  packSize: string;
  price: number;
  available: boolean;
  image: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  studentId: string;
  email: string;
  phone: string;
  accommodation: string;
  preferredLocation: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  packSize: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CheckoutDraft {
  fullName: string;
  phone: string;
  studentId: string;
  deliveryLocation: string;
  address: string;
  deliverySlot: DeliverySlot | '';
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  studentId: string;
  phone: string;
  deliveryLocation: string;
  address: string;
  deliverySlot: DeliverySlot;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface EarlyAccessEntry {
  id: string;
  name: string;
  studentId: string;
  phone: string;
  residentialLocation: string;
  preferredProduct: string;
  preferredDeliveryTime: DeliverySlot;
  createdAt: string;
}

export interface PersistedStore {
  users: UserProfile[];
  activeProfile: UserProfile | null;
  cart: CartItem[];
  checkoutDraft: CheckoutDraft;
  orders: Order[];
  earlyAccess: EarlyAccessEntry[];
  availabilityOverrides: Record<string, boolean>;
  whatsappBusinessNumber: string;
}
