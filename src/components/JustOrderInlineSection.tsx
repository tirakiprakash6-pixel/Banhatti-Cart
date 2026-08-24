import React, { useState, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { AppSettings, OrderPayload } from '../types';
import { generateOrderId, submitOrderToScript, saveCustomerInfo } from '../services/api';
import { formatWhatsAppMessage, getWhatsAppUrl, openWhatsAppDirectly, OWNER_WHATSAPP_TARGET } from '../utils/whatsapp';

interface JustOrderInlineSectionProps {
  settings: AppSettings;
  onOrderSuccess: (order: OrderPayload) => void;
  presetText?: string;
}

export const JustOrderInlineSection: React.FC<JustOrderInlineSectionProps> = ({
  settings,
  onOrderSuccess,
  presetText = ''
}) => {
  const [requestText, setRequestText] = useState<string>(presetText);
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [locationText, setLocationText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Always start with completely blank fields
  useEffect(() => {
    try {
      localStorage.removeItem('banhatti_cart_customer');
    } catch (e) {
      // Ignore
    }
  }, []);

  useEffect(() => {
    if (presetText) {
      setRequestText(presetText);
    }
  }, [presetText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!requestText.trim()) {
      setValidationError('Please list the items or store you need from Banhatti.');
      return;
    }
    if (!customerName.trim()) {
      setValidationError('Please enter your Name.');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save customer info locally for instant future orders
      saveCustomerInfo({ name: customerName.trim(), phone: cleanPhone, address: locationText });

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

      const orderPayload: OrderPayload = {
        orderId: generateOrderId(),
        orderType: 'JUST_ORDER',
        customerName: customerName.trim(),
        phone: cleanPhone,
        request: requestText.trim(),
        productsSummary: `[JUST ORDER CUSTOM REQUEST]: ${requestText.trim()}`,
        subtotal: 0,
        totalAmount: 0,
        items: [
          {
            name: requestText.trim() || 'Custom Order Item',
            price: 0,
            quantity: 1,
            unit: 'Custom Request'
          }
        ],
        customerLocation: locationText.trim() || 'Shared during phone call',
        googleMapsLink: '',
        date: dateStr,
        time: timeStr,
        createdAt: now.toISOString(),
        status: 'NEW_ORDER'
      };

      // 1. Prepare WhatsApp message & URL
      const waMsg = formatWhatsAppMessage(orderPayload, settings);
      const waUrl = getWhatsAppUrl(OWNER_WHATSAPP_TARGET, waMsg);

      // 2. Open WhatsApp directly
      openWhatsAppDirectly(waUrl);

      // 3. Submit to Google Sheets via Apps Script Web App in background
      submitOrderToScript(orderPayload, settings.googleScriptUrl).catch((err) => {
        console.warn('Google Sheet background logging notice:', err);
      });

      // 4. Trigger Success modal
      onOrderSuccess(orderPayload);

      // Reset all form fields to completely blank
      setRequestText('');
      setCustomerName('');
      setPhone('');
      setLocationText('');
    } catch (err: any) {
      console.error('Order submission error:', err);
      setValidationError('Failed to send order. Please call us directly or check network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="inline-just-order-form-container" className="bg-white rounded-xl border border-gray-200/80 shadow-2xs overflow-hidden">
      {/* Clean Form Header */}
      <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 bg-white flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
            Custom Order Request
          </h3>
          <p className="text-xs text-gray-400 font-normal">
            write your order manually
          </p>
        </div>
        <span className="text-[11px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
          Quick Delivery
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5">
        {validationError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{validationError}</span>
          </div>
        )}

        {/* 1. Item Request Text */}
        <div>
          <label htmlFor="inline-request-text" className="block text-xs font-semibold text-gray-700 mb-1">
            Items Needed <span className="text-orange-500">*</span>
          </label>
          <textarea
            id="inline-request-text"
            rows={3}
            required
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            placeholder="e.g. 2 kg Sona Masoori Rice, Masala Dosa from Hotel Udupi, and Sweets from Gurunath."
            className="w-full text-xs sm:text-sm p-3 rounded-lg border border-gray-200 bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none placeholder:text-gray-400 text-gray-900 transition-all resize-none"
          />
        </div>

        {/* 2. Customer Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="inline-customer-name" className="block text-xs font-semibold text-gray-700 mb-1">
              Your Name <span className="text-orange-500">*</span>
            </label>
            <input
              id="inline-customer-name"
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Ramesh Kulkarni"
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>

          <div>
            <label htmlFor="inline-customer-phone" className="block text-xs font-semibold text-gray-700 mb-1">
              Mobile Number <span className="text-orange-500">*</span>
            </label>
            <input
              id="inline-customer-phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile number"
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* 3. Address */}
        <div>
          <label htmlFor="inline-customer-location" className="block text-xs font-semibold text-gray-700 mb-1">
            Delivery Address / Landmark <span className="text-gray-400 font-normal">(Optional)</span>
          </label>

          <input
            id="inline-customer-location"
            type="text"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            placeholder="e.g. Near Kalmeshwar Temple, Somwar Peth, Banhatti"
            className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none bg-white text-gray-900 placeholder:text-gray-400"
          />
        </div>

        {/* 4. Action Button */}
        <button
          id="send-just-order-submit-btn"
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Sending Order...</span>
          ) : (
            <>
              <span>Confirm & Place Order</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};


