import { Product, OrderPayload, AppSettings } from '../types';
import { INITIAL_PRODUCTS, DEFAULT_SETTINGS } from '../data/defaultData';

const STORAGE_KEYS = {
  SETTINGS: 'banhatti_cart_settings',
  CUSTOMER_INFO: 'banhatti_cart_customer',
  CART: 'banhatti_cart_items',
  RECENT_ORDERS: 'banhatti_cart_recent_orders',
  SYNCED_PRODUCTS: 'banhatti_synced_products'
};

export const OWNER_WHATSAPP_NUMBER = '917899342585';
export const OWNER_PHONE_NUMBER = '+917899342585';
export const DEFAULT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyH0dSF7Eul9lmQZd_RdrQFGBdFbb2O_wiVF5n84Ez-lalxJItQRVn_TuPyi2sIQ8_1/exec';
export const DEFAULT_PRODUCTS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzciBm0UN2XDSMOmsWKugzc7z7DKbSHW3dyD4sJkyo3v2Hz_3BUbY-bm0l130pD5I02Aw/exec';

export function loadCachedProducts(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SYNCED_PRODUCTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read cached products', e);
  }
  return INITIAL_PRODUCTS;
}

export function saveCachedProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SYNCED_PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save cached products', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Clean up old demo numbers
      if (!parsed.ownerWhatsApp || parsed.ownerWhatsApp.includes('98765') || parsed.ownerWhatsApp !== OWNER_WHATSAPP_NUMBER) {
        parsed.ownerWhatsApp = OWNER_WHATSAPP_NUMBER;
      }
      if (!parsed.ownerPhone || parsed.ownerPhone.includes('98765') || parsed.ownerPhone !== OWNER_PHONE_NUMBER) {
        parsed.ownerPhone = OWNER_PHONE_NUMBER;
      }
      if (!parsed.googleScriptUrl || parsed.googleScriptUrl.trim() === '') {
        parsed.googleScriptUrl = DEFAULT_SCRIPT_URL;
      }
      if (!parsed.productsScriptUrl || parsed.productsScriptUrl.trim() === '') {
        parsed.productsScriptUrl = DEFAULT_PRODUCTS_SCRIPT_URL;
      }
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed));
      return { 
        ...DEFAULT_SETTINGS, 
        ...parsed, 
        ownerWhatsApp: OWNER_WHATSAPP_NUMBER, 
        ownerPhone: OWNER_PHONE_NUMBER,
        productsScriptUrl: parsed.productsScriptUrl || DEFAULT_PRODUCTS_SCRIPT_URL 
      };
    }
  } catch (e) {
    console.error('Failed to read settings from localStorage', e);
  }
  return { 
    ...DEFAULT_SETTINGS, 
    ownerWhatsApp: OWNER_WHATSAPP_NUMBER, 
    ownerPhone: OWNER_PHONE_NUMBER,
    googleScriptUrl: DEFAULT_SCRIPT_URL,
    productsScriptUrl: DEFAULT_PRODUCTS_SCRIPT_URL
  };
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadCustomerInfo(): { name: string; phone: string; address: string } {
  return { name: '', phone: '', address: '' };
}

export function saveCustomerInfo(_info: { name: string; phone: string; address?: string }): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CUSTOMER_INFO);
  } catch (e) {
    // Ignore
  }
}

export async function fetchProductsFromScript(
  scriptUrl?: string
): Promise<{ products: Product[]; error?: string }> {
  const settings = loadSettings();
  const targetUrl = (scriptUrl && scriptUrl.trim().length > 0)
    ? scriptUrl.trim() 
    : (settings.productsScriptUrl || settings.googleScriptUrl || DEFAULT_PRODUCTS_SCRIPT_URL);

  const cached = loadCachedProducts();

  if (!targetUrl || !targetUrl.startsWith('https://script.google.com')) {
    return { products: cached || [] };
  }

  try {
    const url = new URL(targetUrl);
    if (!url.searchParams.has('action')) {
      url.searchParams.set('action', 'getProducts');
    }
    url.searchParams.set('t', Date.now().toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const rawList = Array.isArray(data) ? data : (data.products || data.data || []);

    if (Array.isArray(rawList)) {
      const mapped: Product[] = rawList.map((item: any, idx: number) => {
        const rawCategory = item.category || item.categoryName || item.categoryId || '';
        let category: any = '🛒 Grocery items';

        const lowCat = String(rawCategory).toLowerCase();
        if (lowCat.includes('break fast') || lowCat.includes('breakfast') || lowCat.includes('morning')) {
          category = '🥘 Break fast for morning';
        } else if (lowCat.includes('snack') || lowCat.includes('evening')) {
          category = '🍔 snacks of evening';
        } else if (lowCat.includes('ice cream') || lowCat.includes('icecream') || lowCat.includes('favourite')) {
          category = '🍦 favourite Ice cream';
        } else if (lowCat.includes('bakery')) {
          category = '🧁 Bakery items';
        } else if (lowCat.includes('grocery') || lowCat.includes('dairy') || lowCat.includes('kirana')) {
          category = '🛒 Grocery items';
        } else if (rawCategory) {
          category = rawCategory;
        }

        const img = item.image || item.imageUrl || item.img || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
        const imgList = Array.isArray(item.images) && item.images.length > 0 
          ? item.images 
          : [img];

        return {
          id: String(item.id || `P-${idx + 1}`),
          category: category,
          name: item.name || item.productName || item.title || `Item ${idx + 1}`,
          kannadaName: item.kannadaName || item.nameKannada || item.kannada || '',
          price: Number(item.price) || 0,
          offerPrice: item.offerPrice ? Number(item.offerPrice) : undefined,
          unit: item.unit || item.quantity || item.size || '1 item',
          images: imgList,
          description: item.description || item.desc || '',
          isAvailable: item.isAvailable !== false && String(item.isAvailable).toUpperCase() !== 'FALSE',
          isPopular: item.isPopular === true || String(item.isPopular).toUpperCase() === 'TRUE',
          badge: item.badge || (item.isPopular ? 'Popular' : undefined)
        };
      });

      // Save mapped Google Sheet products to cache
      saveCachedProducts(mapped);
      return { products: mapped };
    }
    return { products: cached || [] };
  } catch (err: any) {
    console.warn('Could not fetch from Google Apps Script:', err);
    return { 
      products: cached || [], 
      error: 'Google Sheets sync offline.' 
    };
  }
}

export async function submitOrderToScript(
  order: OrderPayload, 
  scriptUrl?: string
): Promise<{ success: boolean; message: string; orderId: string }> {
  // Save locally in recent orders history
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.RECENT_ORDERS);
    const list: OrderPayload[] = saved ? JSON.parse(saved) : [];
    list.unshift(order);
    localStorage.setItem(STORAGE_KEYS.RECENT_ORDERS, JSON.stringify(list.slice(0, 10)));
  } catch (e) {
    console.error('Failed to save order to local history', e);
  }

  const targetUrl = (scriptUrl && scriptUrl.trim().length > 0) ? scriptUrl.trim() : DEFAULT_SCRIPT_URL;

  if (!targetUrl || !targetUrl.startsWith('https://script.google.com')) {
    return {
      success: true,
      message: 'Order recorded. Opening WhatsApp for instant owner notification!',
      orderId: order.orderId
    };
  }

  const now = new Date();
  const dateStr = order.date || now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const timeStr = order.time || now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });

  const payload = {
    action: 'createOrder',
    orderId: order.orderId,
    orderType: order.orderType,
    customerName: order.customerName,
    name: order.customerName,
    phone: order.phone,
    customerPhone: order.phone,
    request: order.request || order.productsSummary || '',
    productsSummary: order.productsSummary || order.request || '',
    products: order.productsSummary || order.request || '',
    items: order.productsSummary || order.request || '',
    itemsList: order.productsSummary || order.request || '',
    subtotal: order.subtotal || 0,
    total: order.subtotal || 0,
    customerLocation: order.customerLocation || '',
    location: order.customerLocation || '',
    googleMapsLink: order.googleMapsLink || '',
    mapsLink: order.googleMapsLink || '',
    date: dateStr,
    time: timeStr,
    timestamp: now.toISOString(),
    status: order.status || 'NEW_ORDER'
  };

  try {
    // 1. Primary: POST as text/plain (Google Apps Script parses this inside e.postData.contents without CORS failure)
    await fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    return {
      success: true,
      message: 'Order logged in Google Sheets successfully!',
      orderId: order.orderId
    };
  } catch (err) {
    console.error('Google Apps Script order logging error:', err);
    return {
      success: true,
      message: 'Order ready! Completing via WhatsApp.',
      orderId: order.orderId
    };
  }
}

export function generateOrderId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BC-${rand}`;
}

export function cleanMobileNumber(phone: string): string {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');
  // If user pasted 91XXXXXXXXXX (12 digits), strip country code 91
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.slice(2);
  }
  // If user typed 0XXXXXXXXXX (11 digits with leading 0), strip 0
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }
  // Strictly clamp to maximum 10 digits
  return cleaned.slice(0, 10);
}

export function validateIndianMobile(phone: string): boolean {
  const cleaned = cleanMobileNumber(phone);
  // Valid Indian mobile number is exactly 10 digits starting with 6, 7, 8, or 9
  return /^[6-9]\d{9}$/.test(cleaned);
}
