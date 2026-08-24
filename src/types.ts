export type OrderType = 'PRODUCT_ORDER' | 'JUST_ORDER';

export interface Product {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  offerPrice?: number;
  images: string[];
  unit?: string;
  isAvailable?: boolean;
  kannadaName?: string;
  isPopular?: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  unit?: string;
}

export interface OrderPayload {
  orderId: string;
  orderType: OrderType;
  customerName: string;
  phone: string;
  request: string;
  productsSummary: string;
  subtotal: number;
  totalAmount?: number;
  items?: OrderItem[];
  customerLocation: string;
  googleMapsLink: string;
  date: string;
  time: string;
  createdAt?: string;
  status: 'NEW_ORDER' | 'CONFIRMED' | 'PURCHASING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
}

export interface AppSettings {
  storeName: string;
  tagline: string;
  ownerPhone: string;
  ownerWhatsApp: string;
  googleScriptUrl: string;
  productsScriptUrl?: string;
  isStoreOpen: boolean;
  serviceNotice: string;
  deliveryArea: string;
  currencySymbol: string;
}

export type ModalType = 
  | null 
  | 'CART' 
  | 'JUST_ORDER' 
  | 'DIRECT_ORDER'
  | 'PRODUCT_DETAIL' 
  | 'ORDER_SUCCESS' 
  | 'PRIVACY' 
  | 'TERMS' 
  | 'CONTACT' 
  | 'SETUP_GUIDE'
  | 'SETTINGS';
