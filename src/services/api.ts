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

export interface GeolocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  mapsUrl: string;
  landmarkName?: string;
}

export const BANHATTI_LANDMARKS = [
  { name: 'Kalmeshwar Temple / Main Bazaar', area: 'Kalmeshwar Temple Area', lat: 16.4760, lng: 75.1245 },
  { name: 'Somwar Peth / Gandhi Chowk', area: 'Somwar Peth', lat: 16.4728, lng: 75.1215 },
  { name: 'Govt Hospital / Mahalingpur Road', area: 'Govt Hospital Road', lat: 16.4710, lng: 75.1380 },
  { name: 'KSRTC Bus Stand / Main Road', area: 'KSRTC Bus Stand Area', lat: 16.4782, lng: 75.1205 },
  { name: 'Rabkavi Main Road / Bridge', area: 'Rabkavi Bridge Area', lat: 16.4850, lng: 75.1150 },
  { name: 'Vidyanagar / Rampur Area', area: 'Vidyanagar', lat: 16.4680, lng: 75.1300 },
  { name: 'Tamadaddi / Halyal Road', area: 'Tamadaddi Road', lat: 16.4820, lng: 75.1340 },
  { name: 'Court / Post Office Road', area: 'Court & Post Office Road', lat: 16.4746, lng: 75.1228 },
  { name: 'Nehru Market / Cloth Market', area: 'Nehru Market', lat: 16.4755, lng: 75.1232 },
  { name: 'Basaveshwar Circle / Bypass', area: 'Basaveshwar Circle', lat: 16.4795, lng: 75.1280 }
];

export function getNearestBanhattiLandmark(lat: number, lng: number): string | null {
  let closest: { name: string; dist: number } | null = null;
  for (const lm of BANHATTI_LANDMARKS) {
    const dLat = (lm.lat - lat) * 111;
    const dLng = (lm.lng - lng) * 111 * Math.cos(lat * (Math.PI / 180));
    const distKm = Math.sqrt(dLat * dLat + dLng * dLng);
    if (!closest || distKm < closest.dist) {
      closest = { name: lm.area, dist: distKm };
    }
  }
  // If within 10km of Banhatti, label with nearest local area
  if (closest && closest.dist <= 10) {
    return `${closest.name}, Banhatti`;
  }
  return null;
}

export function getCurrentLocation(): Promise<GeolocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser. Please choose your area below.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const nearest = getNearestBanhattiLandmark(latitude, longitude);
        resolve({
          latitude,
          longitude,
          accuracy,
          mapsUrl: `https://maps.google.com/?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`,
          landmarkName: nearest || undefined
        });
      },
      (error) => {
        let msg = 'Unable to get GPS location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access is not allowed by your browser. Please select your Banhatti area below.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'GPS signal unavailable. Please select your area below.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'GPS request timed out. Please select your area below.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
}

export function generateOrderId(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BC-${rand}`;
}
