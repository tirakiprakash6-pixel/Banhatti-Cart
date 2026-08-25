import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Send } from 'lucide-react';
import { AppSettings, OrderPayload } from '../types';
import { generateOrderId, submitOrderToScript, saveCustomerInfo, validateIndianMobile, cleanMobileNumber } from '../services/api';
import { formatWhatsAppMessage, getWhatsAppUrl, openWhatsAppDirectly, OWNER_WHATSAPP_TARGET } from '../utils/whatsapp';

interface JustOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onOrderSuccess: (order: OrderPayload) => void;
  initialCategory?: string;
}

export const JustOrderModal: React.FC<JustOrderModalProps> = ({
  isOpen,
  onClose,
  settings,
  onOrderSuccess,
  initialCategory
}) => {
  const [requestText, setRequestText] = useState<string>(() => {
    return initialCategory ? `[Regarding ${initialCategory}]: ` : '';
  });
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [locationText, setLocationText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Always start with completely blank fields
  useEffect(() => {
    if (!isOpen) return;
    try {
      localStorage.removeItem('banhatti_cart_customer');
    } catch (e) {
      // Ignore
    }
    if (initialCategory && !requestText) {
      setRequestText(`[Regarding ${initialCategory}]: `);
    }
  }, [isOpen, initialCategory, requestText]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!requestText.trim()) {
      setValidationError('Please specify what you need (e.g. 2 kg rice, 1 box of sweets, medicine, etc.)');
      return;
    }
    if (!customerName.trim()) {
      setValidationError('Please enter your Name');
      return;
    }
    const cleanPhone = cleanMobileNumber(phone);
    if (!validateIndianMobile(cleanPhone)) {
      setValidationError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save customer info for next time
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
        productsSummary: `[CUSTOM REQUEST]: ${requestText.trim()}`,
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

      // 1. Prepare WhatsApp redirect
      const waMsg = formatWhatsAppMessage(orderPayload, settings);
      const waUrl = getWhatsAppUrl(OWNER_WHATSAPP_TARGET, waMsg);

      // 2. Open WhatsApp immediately to avoid popup blocker
      openWhatsAppDirectly(waUrl);

      // 3. Submit to Google Sheets via Apps Script Web App in background
      submitOrderToScript(orderPayload, settings.googleScriptUrl).catch((err) => {
        console.warn('Google Sheet background logging notice:', err);
      });

      // 4. Trigger app success state
      onOrderSuccess(orderPayload);
      
      // Reset all fields
      setRequestText('');
      setCustomerName('');
      setPhone('');
      setLocationText('');
      onClose();
    } catch (err: any) {
      console.error('Order submission error:', err);
      setValidationError('Failed to send order. Please call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="just-order-modal-overlay"
      className="fixed inset-0 z-50 bg-[#1A1A1A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="just-order-modal-content"
        className="bg-[#FDFCFB] rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E7E5E0] relative my-auto animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Header */}
        <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-lg shrink-0 border border-orange-100">
              🛵
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 leading-tight">
                Just Order
              </h3>
              <p className="text-xs text-gray-400 font-normal">
                Custom order
              </p>
            </div>
          </div>
          <button
            id="close-just-order-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice */}
        <div className="bg-orange-50/70 border-b border-orange-100/80 px-5 py-2.5 flex items-center gap-2 text-xs text-orange-900">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
          <p className="leading-tight">
            Write your order manually
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Items Needed */}
          <div>
            <label htmlFor="just-order-text" className="block text-xs font-semibold text-gray-700 mb-1">
              Items Needed <span className="text-orange-500">*</span>
            </label>
            <textarea
              id="just-order-text"
              rows={3}
              required
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="e.g. 2 kg Sona Masoori rice, 1 box Mysore Pak from Gurunath Sweets, and medicines from Apollo."
              className="w-full text-xs sm:text-sm p-3 rounded-lg border border-gray-200 bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all placeholder:text-gray-400 text-gray-900 resize-none"
            />
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="just-order-name" className="block text-xs font-semibold text-gray-700 mb-1">
                Your Name <span className="text-orange-500">*</span>
              </label>
              <input
                id="just-order-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Anand Pattar"
                className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="just-order-phone" className="block text-xs font-semibold text-gray-700 mb-1">
                Mobile Number <span className="text-orange-500">*</span> <span className="text-gray-400 font-normal">(10 digits)</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-semibold text-gray-500 pointer-events-none select-none">
                  +91
                </span>
                <input
                  id="just-order-phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPhone(val.slice(0, 10));
                  }}
                  placeholder="9876543210"
                  className="w-full text-xs sm:text-sm pl-12 pr-3 py-2 rounded-lg border border-gray-200 bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-gray-900 placeholder:text-gray-400 font-medium tracking-wide"
                />
              </div>
            </div>
          </div>

          {/* Delivery Location */}
          <div>
            <label htmlFor="just-order-location" className="block text-xs font-semibold text-gray-700 mb-1">
              Delivery Address / Landmark <span className="text-gray-400 font-normal">(Optional)</span>
            </label>

            <input
              id="just-order-location"
              type="text"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              placeholder="e.g. Somwar Peth, near Basaveshwara Temple, Banhatti"
              className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none bg-white text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Submit Button */}
          <button
            id="submit-just-order-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Sending Request...</span>
            ) : (
              <>
                <span>Confirm & Place Order</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
