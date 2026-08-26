import { OrderPayload, AppSettings } from '../types';

export const OWNER_WHATSAPP_TARGET = '917899342585';
export const OWNER_PHONE_TARGET = '+91 7899342585';

export function formatWhatsAppMessage(order: OrderPayload, settings: AppSettings): string {
  const currency = settings.currencySymbol || '₹';
  const isJustOrder = order.orderType === 'JUST_ORDER';

  const lines: string[] = [];

  // Header
  lines.push('*BANHATTI CART*');
  lines.push('────────────────────────');

  // Customer
  lines.push('*Customer*');
  lines.push(`• Name: ${order.customerName}`);
  lines.push(`• Phone: ${order.phone}`);
  if (order.customerLocation) {
    lines.push(`• Address: ${order.customerLocation}`);
  }
  if (order.googleMapsLink) {
    lines.push(`• GPS Location: ${order.googleMapsLink}`);
  }
  lines.push('');

  // Order Items
  if (isJustOrder) {
    lines.push('*Requested Items / Details*');
    lines.push(order.request || order.productsSummary || 'Custom order items requested.');
    lines.push('');
    lines.push('*Payment & Delivery*');
    lines.push('• Payment Mode: Cash on Delivery / UPI');
    lines.push('• Delivery: Standard local delivery');
    lines.push('');
  } else {
    lines.push('*Items Ordered*');
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        const unitSuffix = item.unit ? ` (${item.unit})` : '';
        const itemTotal = item.price * item.quantity;
        lines.push(`• ${item.name}${unitSuffix} × ${item.quantity} — ${currency}${itemTotal}`);
      });
    } else if (order.productsSummary) {
      const summaryLines = order.productsSummary.split('\n').filter(l => l.trim().length > 0);
      summaryLines.forEach(line => {
        const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
        lines.push(`• ${cleanLine}`);
      });
    }
    lines.push('');

    // Billing Summary
    lines.push('*Billing Summary*');
    lines.push(`• Items Total: ${currency}${order.subtotal}`);
    lines.push('• Delivery Fee: Confirmed on call');
    lines.push('• Payment Mode: Cash on Delivery / UPI');
    lines.push('');
  }

  // Footer & Timestamp
  lines.push(`Order Date: ${order.date}, ${order.time}`);
  lines.push('────────────────────────');
  if (isJustOrder) {
    lines.push('_Our team will call to confirm product availability and pricing._');
  } else {
    lines.push('_Thank you for ordering with Banhatti Cart!_');
  }

  return lines.join('\n');
}

export function getWhatsAppUrl(phone?: string, message?: string): string {
  let cleanPhone = (phone || '').replace(/[^0-9]/g, '');

  // Strictly eliminate demo numbers like 9876543210 and enforce Owner's 7899342585
  if (!cleanPhone || cleanPhone.includes('9876543210') || cleanPhone === '919876543210' || cleanPhone.length < 10) {
    cleanPhone = OWNER_WHATSAPP_TARGET;
  } else if (cleanPhone.length === 10) {
    cleanPhone = `91${cleanPhone}`;
  }

  // Ensure it targets owner's number
  if (cleanPhone.includes('98765')) {
    cleanPhone = OWNER_WHATSAPP_TARGET;
  }

  const encodedText = encodeURIComponent(message || '');
  // api.whatsapp.com/send directly opens the chat with phone and pre-filled text
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}

export function openWhatsAppDirectly(url: string): void {
  try {
    // 1. Try window.open in a new tab
    const newTab = window.open(url, '_blank', 'noopener,noreferrer');
    if (newTab) {
      newTab.opener = null;
      return;
    }
  } catch (e) {
    // Fallthrough to link click
  }

  try {
    // 2. Fallback: Create and click an invisible target="_blank" anchor tag
    // This safely opens external links in a new window/app tab without destroying the current iframe or page
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 100);
  } catch (e) {
    console.warn('Could not auto-open WhatsApp link:', e);
  }
}
